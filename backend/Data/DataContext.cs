using Microsoft.EntityFrameworkCore;
using TrocaItens.Api.Models;

namespace TrocaItens.Api.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    public DbSet<User> Usuarios { get; set; }
    public DbSet<Publicacao> Publicacoes { get; set; }
    public DbSet<Comentario> Comentarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.SenhaHash).IsRequired();
            entity.Property(e => e.CriadoEm).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasMany(u => u.Publicacoes)
                .WithOne(p => p.Usuario)
                .HasForeignKey(p => p.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Publicacao>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Titulo).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Descricao).IsRequired();
            entity.Property(e => e.Categoria).IsRequired().HasMaxLength(50);
            entity.Property(e => e.CriadoEm).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.AtualizadoEm).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(p => p.Usuario)
                .WithMany(u => u.Publicacoes)
                .HasForeignKey(p => p.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(p => p.Comentarios)
                .WithOne(c => c.Publicacao)
                .HasForeignKey(c => c.PublicacaoId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Comentario>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Conteudo).IsRequired();
            entity.Property(e => e.CriadoEm).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(c => c.Usuario)
                .WithMany()
                .HasForeignKey(c => c.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(c => c.Publicacao)
                .WithMany(p => p.Comentarios)
                .HasForeignKey(c => c.PublicacaoId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
