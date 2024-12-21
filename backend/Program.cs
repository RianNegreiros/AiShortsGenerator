using System.Text.Json;
using AiShortsGenerator.Services;

var builder = WebApplication.CreateBuilder(args);

// Register HttpClient and the GoogleApiService
builder.Services.AddHttpClient<GoogleApiService>();

var app = builder.Build();

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
            if (!json.TryGetProperty("userInput", out var userInputJson) || string.IsNullOrWhiteSpace(userInputJson.GetString()))
            {
                return Results.BadRequest(new { success = false, message = "Required parameter 'userInput' is missing or invalid" });
            }
            string apiKey = builder.Configuration["ApiSettings:ApiKey"];
            string userInput = userInputJson.GetString()!;
            string result = await googleApiService.CallGoogleAPI(userInput, apiKey);
            return Results.Ok(new { success = true, data = result });
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