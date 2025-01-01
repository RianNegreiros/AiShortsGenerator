namespace AiShortsGenerator.Models;

public class Mp3File(string fileName, byte[] fileData)
{
    public string FileName { get; init; } = fileName;
    public byte[] FileData { get; init; } = fileData;
    public DateTime CreatedAt { get; init; }
}