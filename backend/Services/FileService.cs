namespace TrocaItens.Api.Services;

public class FileService : IFileService
{
    private readonly IWebHostEnvironment _environment;
    private readonly long _maxFileSize = 5 * 1024 * 1024;
    private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

    public FileService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string> SaveFileAsync(IFormFile file, string folder)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("Arquivo inválido");

        if (file.Length > _maxFileSize)
            throw new ArgumentException("Arquivo muito grande. Tamanho máximo: 5MB");

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_allowedExtensions.Contains(extension))
            throw new ArgumentException("Tipo de arquivo não permitido");

        var uploadsFolder = Path.Combine(_environment.WebRootPath, folder);
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Path.Combine(folder, uniqueFileName).Replace("\\", "/");
    }

    public void DeleteFile(string filePath)
    {
        if (string.IsNullOrEmpty(filePath)) return;

        var fullPath = Path.Combine(_environment.WebRootPath, filePath);
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }
    }
}
