namespace AiShortsGenerator.Models;

public class TranscriptSegment
{
    public double Confidence { get; set; }
    public double Start { get; set; }
    public double End { get; set; }
    public string Text { get; set; }
    public string Channel { get; set; }
    public string Speaker { get; set; }
}