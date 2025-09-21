namespace TrocaItens.Api.Models;

public class Publicacao
{
    public int Id { get; set; }
    public required string Titulo { get; set; }
    public required string Descricao { get; set; }
    public required string Categoria { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
    public int UsuarioId { get; set; }
    public User Usuario { get; set; } = null!;
    public ICollection<Comentario> Comentarios { get; set; } = new List<Comentario>();
}