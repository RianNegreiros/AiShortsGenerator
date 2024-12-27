namespace AiShortsGenerator.DTOs
{
    public class CloudflareApiResponse
    {
        public CloudflareResult Result { get; set; }
        public bool Success { get; set; }
        public List<string> Errors { get; set; }
        public List<string> Messages { get; set; }
    }

    public class CloudflareResult
    {
        public string Image { get; set; }
    }
}