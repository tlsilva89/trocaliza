namespace TrocaItens.Api.DTOs;

public class PublicacaoDto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public string? ImagemUrl { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
    public int UsuarioId { get; set; }
    public string NomeUsuario { get; set; } = string.Empty;
    public List<ComentarioDto> Comentarios { get; set; } = new();
}

public class CreatePublicacaoDto
{
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
}

public class UpdatePublicacaoDto
{
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
}

public class ComentarioDto
{
    public int Id { get; set; }
    public string Conteudo { get; set; } = string.Empty;
    public DateTime CriadoEm { get; set; }
    public int UsuarioId { get; set; }
    public string NomeUsuario { get; set; } = string.Empty;
}

public class CreateComentarioDto
{
    public string Conteudo { get; set; } = string.Empty;
}
