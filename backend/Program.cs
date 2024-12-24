using System.Text.Json;
using AiShortsGenerator.Models;
using AiShortsGenerator.Services;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<GeminiApiService>();
builder.Services.AddScoped<TextToSpeechService>();
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

            var userInput = userInputJson.GetString()!;
            var apiKey = builder.Configuration["GoogleApi:GeminiKey"];
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

app.MapPost("/generate-audio", async (TextToSpeechService textToSpeechService, [FromBody] JsonElement body) =>
    {
        if (!body.TryGetProperty("input", out var inputJson) || string.IsNullOrWhiteSpace(inputJson.GetString()))
        {
            return Results.BadRequest(new { success = false, message = "Required parameter 'input' is missing or invalid." });
        }

        var input = inputJson.GetString()!;
        try
        {
            var apiKey = builder.Configuration["GoogleApi:TextToSpeechKey"];
            var filePath = await textToSpeechService.SynthesizeTextToSpeech(input, apiKey);

            return Results.Ok(new { FilePath = filePath });
        }
        catch (Exception ex)
        {
            return Results.Problem(detail: ex.Message);
        }
    })
    .WithName("GenerateAudio")
    .Produces(200)
    .Produces(400);

app.Run();