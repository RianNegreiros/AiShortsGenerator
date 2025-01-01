using Google.Cloud.TextToSpeech.V1;

namespace AiShortsGenerator.Services;

public class TextToSpeechService(IConfiguration configuration)
{
    public async Task<byte[]> SynthesizeTextToSpeech(string inputText)
    {
        if (string.IsNullOrWhiteSpace(inputText))
        {
            throw new ArgumentException("Input text cannot be null or empty", nameof(inputText));
        }

        var client = await new TextToSpeechClientBuilder
        {
            ApiKey = configuration["GoogleApi:TextToSpeechKey"]
        }.BuildAsync();

        var input = new SynthesisInput
        {
            Text = inputText
        };

        var voiceSelection = new VoiceSelectionParams
        {
            LanguageCode = "en-US",
            SsmlGender = SsmlVoiceGender.Neutral
        };

        var audioConfig = new AudioConfig
        {
            AudioEncoding = AudioEncoding.Mp3
        };

        var response = await client.SynthesizeSpeechAsync(input, voiceSelection, audioConfig);
        return response.AudioContent.ToArray();
    }
}