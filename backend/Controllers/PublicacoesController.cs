using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrocaItens.Api.Data;
using TrocaItens.Api.DTOs;
using TrocaItens.Api.Models;
using TrocaItens.Api.Services;
using System.Security.Claims;

namespace TrocaItens.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PublicacoesController : ControllerBase
{
    private readonly DataContext _context;
    private readonly IFileService _fileService;

    public PublicacoesController(DataContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PublicacaoDto>>> GetPublicacoes()
    {
        var publicacoes = await _context.Publicacoes
            .Include(p => p.Usuario)
            .Include(p => p.Comentarios)
                .ThenInclude(c => c.Usuario)
            .OrderByDescending(p => p.CriadoEm)
            .Select(p => new PublicacaoDto
            {
                Id = p.Id,
                Titulo = p.Titulo,
                Descricao = p.Descricao,
                Categoria = p.Categoria,
                ImagemUrl = p.ImagemUrl,
                CriadoEm = p.CriadoEm,
                AtualizadoEm = p.AtualizadoEm,
                UsuarioId = p.UsuarioId,
                NomeUsuario = p.Usuario.Nome,
                Comentarios = p.Comentarios.Select(c => new ComentarioDto
                {
                    Id = c.Id,
                    Conteudo = c.Conteudo,
                    CriadoEm = c.CriadoEm,
                    UsuarioId = c.UsuarioId,
                    NomeUsuario = c.Usuario.Nome
                }).ToList()
            })
            .ToListAsync();

        return Ok(publicacoes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PublicacaoDto>> GetPublicacao(int id)
    {
        var publicacao = await _context.Publicacoes
            .Include(p => p.Usuario)
            .Include(p => p.Comentarios)
                .ThenInclude(c => c.Usuario)
            .Where(p => p.Id == id)
            .Select(p => new PublicacaoDto
            {
                Id = p.Id,
                Titulo = p.Titulo,
                Descricao = p.Descricao,
                Categoria = p.Categoria,
                ImagemUrl = p.ImagemUrl,
                CriadoEm = p.CriadoEm,
                AtualizadoEm = p.AtualizadoEm,
                UsuarioId = p.UsuarioId,
                NomeUsuario = p.Usuario.Nome,
                Comentarios = p.Comentarios.Select(c => new ComentarioDto
                {
                    Id = c.Id,
                    Conteudo = c.Conteudo,
                    CriadoEm = c.CriadoEm,
                    UsuarioId = c.UsuarioId,
                    NomeUsuario = c.Usuario.Nome
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (publicacao == null)
        {
            return NotFound();
        }

        return Ok(publicacao);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Publicacao>> CreatePublicacao([FromForm] CreatePublicacaoDto publicacaoDto, [FromForm] IFormFile? imagem)
    {
        var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        string? imagemUrl = null;
        if (imagem != null)
        {
            try
            {
                imagemUrl = await _fileService.SaveFileAsync(imagem, "uploads/publicacoes");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        var publicacao = new Publicacao
        {
            Titulo = publicacaoDto.Titulo,
            Descricao = publicacaoDto.Descricao,
            Categoria = publicacaoDto.Categoria,
            ImagemUrl = imagemUrl,
            UsuarioId = usuarioId,
            CriadoEm = DateTime.UtcNow,
            AtualizadoEm = DateTime.UtcNow
        };

        _context.Publicacoes.Add(publicacao);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPublicacao), new { id = publicacao.Id }, publicacao);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdatePublicacao(int id, [FromForm] UpdatePublicacaoDto publicacaoDto, [FromForm] IFormFile? imagem)
    {
        var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var publicacao = await _context.Publicacoes.FindAsync(id);

        if (publicacao == null)
        {
            return NotFound();
        }

        if (publicacao.UsuarioId != usuarioId)
        {
            return Forbid();
        }

        if (imagem != null)
        {
            try
            {
                if (!string.IsNullOrEmpty(publicacao.ImagemUrl))
                {
                    _fileService.DeleteFile(publicacao.ImagemUrl);
                }
                publicacao.ImagemUrl = await _fileService.SaveFileAsync(imagem, "uploads/publicacoes");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        publicacao.Titulo = publicacaoDto.Titulo;
        publicacao.Descricao = publicacaoDto.Descricao;
        publicacao.Categoria = publicacaoDto.Categoria;
        publicacao.AtualizadoEm = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeletePublicacao(int id)
    {
        var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var publicacao = await _context.Publicacoes.FindAsync(id);

        if (publicacao == null)
        {
            return NotFound();
        }

        if (publicacao.UsuarioId != usuarioId)
        {
            return Forbid();
        }

        if (!string.IsNullOrEmpty(publicacao.ImagemUrl))
        {
            _fileService.DeleteFile(publicacao.ImagemUrl);
        }

        _context.Publicacoes.Remove(publicacao);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{id}/comentarios")]
    [Authorize]
    public async Task<ActionResult<Comentario>> AddComentario(int id, CreateComentarioDto comentarioDto)
    {
        var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var publicacao = await _context.Publicacoes.FindAsync(id);

        if (publicacao == null)
        {
            return NotFound();
        }

        var comentario = new Comentario
        {
            Conteudo = comentarioDto.Conteudo,
            UsuarioId = usuarioId,
            PublicacaoId = id,
            CriadoEm = DateTime.UtcNow
        };

        _context.Comentarios.Add(comentario);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPublicacao), new { id = publicacao.Id }, comentario);
    }

    [HttpGet("minhas")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<PublicacaoDto>>> GetMinhasPublicacoes()
    {
        var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var publicacoes = await _context.Publicacoes
            .Include(p => p.Usuario)
            .Include(p => p.Comentarios)
            .Where(p => p.UsuarioId == usuarioId)
            .OrderByDescending(p => p.CriadoEm)
            .Select(p => new PublicacaoDto
            {
                Id = p.Id,
                Titulo = p.Titulo,
                Descricao = p.Descricao,
                Categoria = p.Categoria,
                ImagemUrl = p.ImagemUrl,
                CriadoEm = p.CriadoEm,
                AtualizadoEm = p.AtualizadoEm,
                UsuarioId = p.UsuarioId,
                NomeUsuario = p.Usuario.Nome,
                Comentarios = p.Comentarios.Select(c => new ComentarioDto
                {
                    Id = c.Id,
                    Conteudo = c.Conteudo,
                    CriadoEm = c.CriadoEm,
                    UsuarioId = c.UsuarioId,
                    NomeUsuario = c.Usuario.Nome
                }).ToList()
            })
            .ToListAsync();

        return Ok(publicacoes);
    }
}
