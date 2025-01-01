using AssemblyAI;
using AssemblyAI.Transcripts;

namespace AiShortsGenerator.Services;

public class AssemblyAiService(IConfiguration configuration)
{
    public async Task<IEnumerable<TranscriptWord>> Transcribe(string fileUrl)
    {
        var apiKey = configuration["AssemblyAi:ApiKey"];

        if (string.IsNullOrEmpty(apiKey))
        {
            throw new InvalidOperationException("API key is not configured");
        }

        var client = new AssemblyAIClient(apiKey);

        var transcriptParams = new TranscriptParams
        {
            AudioUrl = fileUrl
        };

        var transcript = await client.Transcripts.TranscribeAsync(transcriptParams);

        transcript.EnsureStatusCompleted();

        if (transcript.Words == null)
        {
            throw new InvalidOperationException("Transcript contains no words.");
        }

        return transcript.Words;
    }
}