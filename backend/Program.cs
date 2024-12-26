using System.Text.Json;
using AiShortsGenerator.Models;
using AiShortsGenerator.Services;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<GeminiApiService>();
builder.Services.AddScoped<TextToSpeechService>();
builder.Services.AddScoped<AssemblyAiService>();
builder.Services.AddSingleton<Cloudinary>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });

    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors(app.Environment.IsDevelopment() ? "AllowAll" : "AllowSpecificOrigins");

app.MapPost("/generate-content", async (GeminiApiService googleApiService, [FromBody] JsonElement body) =>
    {
        try
        {
            if (!body.TryGetProperty("input", out var userInputJson) || string.IsNullOrWhiteSpace(userInputJson.GetString()))
            {
                return Results.BadRequest(new { success = false, message = "Required parameter 'input' is missing or invalid." });
            }

            var apiKey = builder.Configuration["GoogleApi:GeminiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return Results.BadRequest(new { success = false, message = "API key is missing or not configured." });
            }

            var userInput = userInputJson.GetString()!;
            var result = await googleApiService.CallGoogleApi(userInput, apiKey);

            return Results.Ok(result);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { success = false, message = ex.Message });
        }
    })
    .WithName("GenerateContent")
    .Produces<List<VideoContentItem>>(200)
    .Produces(400);

app.MapPost("/generate-audio", async (TextToSpeechService textToSpeechService, Cloudinary audioUploadService, [FromBody] JsonElement body) =>
    {
        if (!body.TryGetProperty("input", out var inputJson) || string.IsNullOrWhiteSpace(inputJson.GetString()))
        {
            return Results.BadRequest(new { success = false, message = "Required parameter 'input' is missing or invalid." });
        }

        var input = inputJson.GetString()!;
        try
        {
            var apiKey = builder.Configuration["GoogleApi:TextToSpeechKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return Results.BadRequest(new { success = false, message = "API key is missing or not configured." });
            }

            var mp3Data = await textToSpeechService.SynthesizeTextToSpeech(input, apiKey);
            var audioUrl = await audioUploadService.UploadAudio(mp3Data);
            return Results.Ok(audioUrl);
        }
        catch (Exception ex)
        {
            return Results.Problem(detail: ex.Message);
        }
    })
    .WithName("GenerateAudio")
    .Produces(200)
    .Produces(400);

app.MapPost("/generate-captions", async (AssemblyAiService assemblyAiService, [FromBody] JsonElement body) =>
    {
        if (!body.TryGetProperty("fileUrl", out var inputJson) || string.IsNullOrWhiteSpace(inputJson.GetString()))
        {
            return Results.BadRequest(new { success = false, message = "Required parameter 'fileUrl' is missing or invalid." });
        }

        var fileUrl = inputJson.GetString()!;
        try
        {
            var apiKey = builder.Configuration["AssemblyAi:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return Results.BadRequest(new { success = false, message = "API key is missing or not configured." });
            }

            var transcript = await assemblyAiService.Transcribe(fileUrl, apiKey);

            return Results.Ok(transcript);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { success = false, message = ex.Message });
        }
    });

app.Run();