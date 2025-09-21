using TrocaItens.Api.Models;

namespace TrocaItens.Api.Services;

public interface ITokenService
{
    string CreateToken(User user);
}