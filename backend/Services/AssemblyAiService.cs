using AssemblyAI;
using AssemblyAI.Transcripts;

namespace AiShortsGenerator.Services;

public class AssemblyAiService
{
    public async Task<IEnumerable<TranscriptWord>> Transcribe(string fileUrl, string apiKey)
    {
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