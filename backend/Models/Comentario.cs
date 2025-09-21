namespace TrocaItens.Api.Models;

public class Comentario
{
    public int Id { get; set; }
    public required string Conteudo { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public int UsuarioId { get; set; }
    public User Usuario { get; set; } = null!;
    public int PublicacaoId { get; set; }
    public Publicacao Publicacao { get; set; } = null!;
}