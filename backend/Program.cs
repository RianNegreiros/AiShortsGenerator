using System.Text.Json;
using AiShortsGenerator.Services;

var builder = WebApplication.CreateBuilder(args);

// Register HttpClient and the GoogleApiService
builder.Services.AddHttpClient<GoogleApiService>();
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

// Define an endpoint for the API
app.MapPost("/generate-content", async (GoogleApiService googleApiService, HttpContext context) =>
    {
        try
        {
            // Parse the JSON body to get the userInput parameter
            using var reader = new StreamReader(context.Request.Body);
            var body = await reader.ReadToEndAsync();

            if (string.IsNullOrWhiteSpace(body))
            {
                return Results.BadRequest(new { success = false, message = "Request body is empty" });
            }

            var json = JsonSerializer.Deserialize<JsonElement>(body);
            if (!json.TryGetProperty("input", out var userInputJson) || string.IsNullOrWhiteSpace(userInputJson.GetString()))
            {
                return Results.BadRequest(new { success = false, message = "Required parameter 'userInput' is missing or invalid" });
            }
            var apiKey = builder.Configuration["ApiSettings:ApiKey"];
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
    .Produces(200)
    .Produces(400);

app.Run();