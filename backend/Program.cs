using System.Text.Json;
using AiShortsGenerator.Data;
using AiShortsGenerator.Models;
using AiShortsGenerator.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite("Data Source=./app.db");
});

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

app.MapPost("/generate-audio", async (TextToSpeechService textToSpeechService, AppDbContext dbContext, [FromBody] JsonElement body) =>
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

            var mp3File = new Mp3File($"{Guid.NewGuid()}.mp3", mp3Data);

            dbContext.Add(mp3File);
            await dbContext.SaveChangesAsync();

            var downloadUrl = $"{builder.Configuration["BaseUrl"]}/download-audio/{mp3File.Id}";
            return Results.Ok(new
            {
                success = true,
                fileId = mp3File.Id,
                fileName = mp3File.FileName,
                downloadUrl,
            });
        }
        catch (Exception ex)
        {
            return Results.Problem(detail: ex.Message);
        }
    })
    .WithName("GenerateAudio")
    .Produces(200)
    .Produces(400);

app.MapGet("/download-audio/{id:int}", async (int id, AppDbContext dbContext) =>
    {
        var mp3File = await dbContext.Mp3Files.FindAsync(id);
        return mp3File == null ? Results.NotFound() : Results.File(mp3File.FileData, "audio/mpeg", mp3File.FileName);
    });

app.Run();