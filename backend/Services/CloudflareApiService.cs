using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using AiShortsGenerator.DTOs;

namespace AiShortsGenerator.Services;

public class CloudflareApiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiUrl;

    public CloudflareApiService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiUrl = $"https://api.cloudflare.com/client/v4/accounts/{configuration["Cloudflare:AccountId"]}/ai/run/@cf/black-forest-labs/flux-1-schnell";

        var apiKey = configuration["Cloudflare:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))
        {
            throw new ArgumentException("Cloudflare API key is missing in configuration.");
        }

        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", apiKey);
    }

    public async Task<byte[]> GenerateImageAsync(string prompt)
    {
        var payload = new
        {
            prompt
        };

        var jsonPayload = JsonSerializer.Serialize(payload);
        var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(_apiUrl, content);

        if (!response.IsSuccessStatusCode)
        {
            var errorMessage = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Cloudflare API request failed with status code {response.StatusCode}: {errorMessage}");
        }

        var responseContent = await response.Content.ReadFromJsonAsync<CloudflareApiResponse>();

        if (responseContent is not { Success: true })
        {
            var errors = string.Join("; ", responseContent?.Errors ?? ["Unknown error"]);
            throw new HttpRequestException($"Failed to generate image: {errors}");
        }

        if (responseContent.Result.Image == null)
        {
            throw new HttpRequestException("Failed to generate image: No image returned by Cloudflare API.");
        }

        if (!(responseContent.Messages.Count > 0))
        {
            return Convert.FromBase64String(responseContent.Result.Image);
        }

        Console.WriteLine("Cloudflare API Messages:");
        foreach (var message in responseContent.Messages)
        {
            Console.WriteLine($"- {message}");
        }

        return Convert.FromBase64String(responseContent.Result.Image);
    }
}