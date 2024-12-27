using AiShortsGenerator.Models;
using Microsoft.EntityFrameworkCore;

namespace AiShortsGenerator.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Video> Videos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Video>(entity =>
        {
            entity.Property(v => v.VideoContent)
                .HasColumnType("jsonb");

            entity.Property(v => v.Captions)
                .HasColumnType("jsonb");
        });
    }
}