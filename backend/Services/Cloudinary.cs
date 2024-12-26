using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace AiShortsGenerator.Services;

public class Cloudinary(IConfiguration configuration)
{
    private readonly CloudinaryDotNet.Cloudinary _cloudinary = new(configuration["CloudinaryUrl"]);

    public async Task<string> UploadAudio(byte[] audioContent)
    {
        var uploadParams = new AutoUploadParams()
        {
            File = new FileDescription(Guid.NewGuid().ToString(), new MemoryStream(audioContent)),
            Folder = "audio-files",
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
        {
            return uploadResult.SecureUrl.ToString();
        }

        throw new Exception("Audio upload failed: " + uploadResult.Error?.Message);
    }
}