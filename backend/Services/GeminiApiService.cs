namespace AiShortsGenerator.Services;

using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Models;

public class GeminiApiService(HttpClient httpClient, IConfiguration configuration)
{
    public async Task<List<VideoContentItem>> CallGoogleApi(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            throw new ArgumentException("User input cannot be null or empty", nameof(input));
        }

        var apiKey = configuration["GoogleApi:GeminiKey"];

        if (string.IsNullOrEmpty(apiKey))
        {
            throw new InvalidOperationException("API key is not configured");
        }

        string url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={apiKey}";

        string requestBody = $@"{{
            ""contents"": [
                {{
                    ""role"": ""user"",
                    ""parts"": [
                        {{
                            ""text"": ""{input}""
                        }}
                    ]
                }}
            ],
            ""generationConfig"": {{
                ""temperature"": 1,
                ""topK"": 40,
                ""topP"": 0.95,
                ""maxOutputTokens"": 8192,
                ""responseMimeType"": ""application/json""
            }}
        }}";

        var content = new StringContent(requestBody, Encoding.UTF8, "application/json");
        var response = await httpClient.PostAsync(url, content);

        if (response.IsSuccessStatusCode)
        {
            var responseString = await response.Content.ReadAsStringAsync();
            if (!string.IsNullOrEmpty(responseString))
            {
                var dataJson = JsonSerializer.Deserialize<JsonElement>(responseString);

                if (dataJson.TryGetProperty("candidates", out var candidates))
                {
                    var contentText = candidates[0]
                        .GetProperty("content")
                        .GetProperty("parts")[0]
                        .GetProperty("text")
                        .GetString();

                    if (!string.IsNullOrEmpty(contentText))
                    {
                        var videoContentList = JsonSerializer.Deserialize<List<VideoContentItem>>(contentText);

                        if (videoContentList != null)
                        {
                            return videoContentList;
                        }
                    }
                }
            }
        }

        var errorContent = await response.Content.ReadAsStringAsync();
        throw new Exception($"Error calling Google API: {response.StatusCode}, Content: {errorContent}");
    }
}