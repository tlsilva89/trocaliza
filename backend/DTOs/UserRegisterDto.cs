namespace TrocaItens.Api.DTOs;

public class UserRegisterDto
{
    public required string Nome { get; set; }
    public required string Email { get; set; }
    public required string Senha { get; set; }
}