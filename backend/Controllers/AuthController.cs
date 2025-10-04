using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TrocaItens.Api.Data;
using TrocaItens.Api.DTOs;
using TrocaItens.Api.Models;
using TrocaItens.Api.Services;

namespace TrocaItens.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly DataContext _context;
    private readonly ITokenService _tokenService;

    public AuthController(DataContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterDto registerDto)
    {
        if (await _context.Usuarios.AnyAsync(u => u.Email == registerDto.Email))
        {
            return BadRequest("Este email já está em uso.");
        }

        var user = new User
        {
            Nome = registerDto.Nome,
            Email = registerDto.Email,
            SenhaHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Senha)
        };

        _context.Usuarios.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Usuário registrado com sucesso!" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto loginDto)
    {
        var user = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Senha, user.SenhaHash))
        {
            return Unauthorized("Email ou senha inválidos.");
        }

        var token = _tokenService.CreateToken(user);

        return Ok(new { token });
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var user = await _context.Usuarios.FindAsync(usuarioId);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(new
        {
            id = user.Id,
            nome = user.Nome,
            email = user.Email,
            criadoEm = user.CriadoEm
        });
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile(UpdateProfileDto updateDto)
    {
        var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var user = await _context.Usuarios.FindAsync(usuarioId);

        if (user == null)
        {
            return NotFound();
        }

        if (updateDto.Email != user.Email && await _context.Usuarios.AnyAsync(u => u.Email == updateDto.Email))
        {
            return BadRequest("Este email já está em uso.");
        }

        user.Nome = updateDto.Nome;
        user.Email = updateDto.Email;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Perfil atualizado com sucesso!" });
    }
}
