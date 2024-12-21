namespace AiShortsGenerator.Services;

using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

public class GoogleApiService
{
    private readonly HttpClient _httpClient;

    public GoogleApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> CallGoogleAPI(string userInput, string apiKey)
    {
        if (string.IsNullOrWhiteSpace(userInput))
        {
            throw new ArgumentException("User input cannot be null or empty", nameof(userInput));
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
                            ""text"": ""{userInput}""
                        }}
                    ]
                }}
            ],
            ""generationConfig"": {{
                ""temperature"": 1,
                ""topK"": 40,
                ""topP"": 0.95,
                ""maxOutputTokens"": 8192,
                ""responseMimeType"": ""text/plain""
            }}
        }}";

        var content = new StringContent(requestBody, Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync(url, content);

        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();
        }
        else
        {
            string errorContent = await response.Content.ReadAsStringAsync();
            throw new Exception($"Error calling Google API: {response.StatusCode}, Content: {errorContent}");
        }
    }
}