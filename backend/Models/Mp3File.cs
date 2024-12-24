namespace AiShortsGenerator.Models;

public class Mp3File
{
    public int Id { get; set; }
    public string FileName { get; set; }
    public byte[] FileData { get; set; }
    public DateTime CreatedAt { get; set; }
}