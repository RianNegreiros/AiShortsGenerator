namespace AiShortsGenerator.Models;

public class VideoContentItem(string imagePrompt, string contextText)
{
    public string ImagePrompt { get; set; } = imagePrompt;
    public string ContextText { get; set; } = contextText;
}