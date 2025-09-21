namespace TrocaItens.Api.Models;

public class User
{
    public int Id { get; set; }
    public required string Nome { get; set; }
    public required string Email { get; set; }
    public required string SenhaHash { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public ICollection<Publicacao> Publicacoes { get; set; } = new List<Publicacao>();
}