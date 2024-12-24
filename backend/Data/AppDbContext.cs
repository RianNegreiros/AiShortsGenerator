using AiShortsGenerator.Models;
using Microsoft.EntityFrameworkCore;

namespace AiShortsGenerator.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Mp3File> Mp3Files { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Mp3File>().Property(f => f.FileData).IsRequired();
    }
}