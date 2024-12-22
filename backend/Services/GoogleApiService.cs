using System.Text.Json;

namespace AiShortsGenerator.Services;

using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

public class GoogleApiService(HttpClient httpClient)
{
    public async Task<string> CallGoogleApi(string input, string apiKey)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            throw new ArgumentException("User input cannot be null or empty", nameof(input));
        }

        
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
            var dataJson = JsonSerializer.Deserialize<JsonElement>(response.Content.ReadAsStringAsync().Result);
            var textContent = dataJson
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();
            
            if (!string.IsNullOrWhiteSpace(textContent))
            {
                return textContent.Replace("\\n", "\n").Replace("\\\"", "\"");
            }
        }

        var errorContent = await response.Content.ReadAsStringAsync();
        throw new Exception($"Error calling Google API: {response.StatusCode}, Content: {errorContent}");
    }
}