namespace TrocaItens.Api.Services;

public interface IFileService
{
    Task<string> SaveFileAsync(IFormFile file, string folder);
    void DeleteFile(string filePath);
}
