using Microsoft.EntityFrameworkCore;
using TrocaItens.Api.Models;

namespace TrocaItens.Api.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DbSet<User> Usuarios { get; set; }
    public DbSet<Publicacao> Publicacoes { get; set; }
    public DbSet<Comentario> Comentarios { get; set; }
}