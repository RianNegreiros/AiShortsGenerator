using System.Text.Json.Serialization;

namespace AiShortsGenerator.Models;

public class Video
{
    public int Id { get; set; }

    [JsonInclude]
    public List<VideoContentItem> VideoContent { get; set; } = [];

    public string AudioFileUrl { get; set; }

    [JsonInclude]
    public List<TranscriptSegment> Captions { get; set; } = [];

    public List<string> Images { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? OutputFile { get; set; }
    public string? RenderId { get; set; }
}