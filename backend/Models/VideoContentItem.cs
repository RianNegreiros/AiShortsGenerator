namespace AiShortsGenerator.Models;

public class VideoContentItem(string imagePrompt, string contextText)
{
    public int Id { get; set; }
    public string ImagePrompt { get; set; } = imagePrompt;
    public string ContextText { get; set; } = contextText;
}