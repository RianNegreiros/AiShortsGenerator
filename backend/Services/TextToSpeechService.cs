using Google.Cloud.TextToSpeech.V1;

namespace AiShortsGenerator.Services;

public class TextToSpeechService
{
    public async Task<string> SynthesizeTextToSpeech(string inputText, string apiKey)
    {
        if (string.IsNullOrWhiteSpace(inputText))
        {
            throw new ArgumentException("Input text cannot be null or empty", nameof(inputText));
        }

        var client = await new TextToSpeechClientBuilder
        {
            ApiKey = apiKey,
        }.BuildAsync();

        var input = new SynthesisInput
        {
            Text = inputText
        };

        var voiceSelection = new VoiceSelectionParams
        {
            LanguageCode = "en-US",
            SsmlGender = SsmlVoiceGender.Neutral,
        };

        var audioConfig = new AudioConfig
        {
            AudioEncoding = AudioEncoding.Mp3,
        };

        var response = await client.SynthesizeSpeechAsync(input, voiceSelection, audioConfig);
        
        var projectDirectory = AppDomain.CurrentDomain.BaseDirectory;
        var audioDirectory = Path.Combine(projectDirectory, "GeneratedAudio");
        
        if (!Directory.Exists(audioDirectory))
        {
            Directory.CreateDirectory(audioDirectory);
        }
        
        var fileName = $"{Guid.NewGuid()}.mp3";
        var outputFilePath = Path.Combine(audioDirectory, fileName);
        await File.WriteAllBytesAsync(outputFilePath, response.AudioContent.ToArray());

        return outputFilePath;
    }
}