using Alamee.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Alamee.Api.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectImage> ProjectImages => Set<ProjectImage>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<WebsiteSection> WebsiteSections => Set<WebsiteSection>();
    public DbSet<WebsiteSetting> WebsiteSettings => Set<WebsiteSetting>();
    public DbSet<MediaFile> MediaFiles => Set<MediaFile>();
    public DbSet<ThreeDModel> ThreeDModels => Set<ThreeDModel>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<SeoSetting> SeoSettings => Set<SeoSetting>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<ContentVersion> ContentVersions => Set<ContentVersion>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        base.OnModelCreating(mb);
        mb.Entity<Project>().HasMany(p => p.Images).WithOne(i => i.Project!).OnDelete(DeleteBehavior.Cascade);
        mb.Entity<WebsiteSetting>().HasIndex(s => s.Key).IsUnique();
        mb.Entity<SeoSetting>().HasIndex(s => s.Page).IsUnique();
        mb.Entity<ThreeDModel>().HasIndex(m => m.IsMain);
    }
}
