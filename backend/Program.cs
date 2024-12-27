using System.Text.Json;
using AiShortsGenerator.Data;
using AiShortsGenerator.DTOs;
using AiShortsGenerator.Models;
using AiShortsGenerator.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<GeminiApiService>();
builder.Services.AddScoped<TextToSpeechService>();
builder.Services.AddScoped<AssemblyAiService>();
builder.Services.AddSingleton<CloudinaryService>();
builder.Services.AddHttpClient<CloudflareApiService>();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var dataSourceBuilder = new NpgsqlDataSourceBuilder(builder.Configuration.GetConnectionString("DefaultConnection"));
    dataSourceBuilder.EnableDynamicJson();
    options.UseNpgsql(dataSourceBuilder.Build());
});
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

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

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

app.MapPost("/generate-audio", async (TextToSpeechService textToSpeechService, CloudinaryService cloudinary, [FromBody] JsonElement body) =>
    {
        if (!body.TryGetProperty("input", out var inputJson) || string.IsNullOrWhiteSpace(inputJson.GetString()))
        {
            return Results.BadRequest(new { success = false, message = "Required parameter 'input' is missing or invalid." });
        }

        var input = inputJson.GetString()!;
        try
        {
            var mp3Data = await textToSpeechService.SynthesizeTextToSpeech(input);
            var audioUrl = await cloudinary.UploadAudio(mp3Data);
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

app.MapPost("/generate-image", async (
    CloudflareApiService cloudflareApiService,
    CloudinaryService cloudinary,
    [FromBody] GenerateImageRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Prompt))
    {
        return Results.BadRequest("Prompt is required.");
    }

    try
    {
        var imageBytes = await cloudflareApiService.GenerateImageAsync(request.Prompt);
        var imageUrl = await cloudinary.UploadImage(imageBytes);
        return Results.Ok(imageUrl);
    }
    catch (HttpRequestException ex)
    {
        return Results.Problem(ex.Message, statusCode: 500);
    }
});

app.MapPost("/save-video", async ([FromBody] Video video, AppDbContext context) =>
{
    await context.Videos.AddAsync(video);
    await context.SaveChangesAsync();

    return Results.Ok(new { message = "Video saved successfully", videoId = video.Id });
});

app.MapGet("/videos/{id:int}", async (int id, AppDbContext context) =>
{
    var video = await context.Videos.FirstOrDefaultAsync(v => v.Id == id);

    return video == null ? Results.NotFound() : Results.Ok(video);
});

app.MapGet("/videos", async (AppDbContext context) =>
{
    var videos = await context.Videos.ToListAsync();

    return Results.Ok(videos);
});


app.Run();