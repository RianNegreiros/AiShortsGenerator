namespace AiShortsGenerator.Models;

public abstract class VideoContentItem(string imagePrompt, string contextText)
{
    public string ImagePrompt { get; set; } = imagePrompt;
    public string ContextText { get; set; } = contextText;
}