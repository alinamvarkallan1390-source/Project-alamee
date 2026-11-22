using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Alamee.Api.Models;

public class ApplicationUser : IdentityUser
{
    public string DisplayName { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Project
{
    public Guid Id { get; set; } = Guid.NewGuid();
    [Required, MaxLength(300)] public string Title { get; set; } = "";
    [MaxLength(300)] public string Slug { get; set; } = "";
    public string Description { get; set; } = "";
    [MaxLength(300)] public string Location { get; set; } = "";
    [MaxLength(100)] public string Category { get; set; } = "Residential";
    [MaxLength(50)] public string Status { get; set; } = "Planned";
    public DateTime? CompletionDate { get; set; }
    [Column(TypeName = "numeric(12,2)")] public decimal? AreaSqm { get; set; }
    public int? Floors { get; set; }
    public int? Units { get; set; }
    public string CoverImage { get; set; } = "";
    public string ModelUrl { get; set; } = "";
    public bool IsPublished { get; set; } = true;
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<ProjectImage> Images { get; set; } = new List<ProjectImage>();
}

public class ProjectImage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProjectId { get; set; }
    public Project? Project { get; set; }
    public string Url { get; set; } = "";
    public string Caption { get; set; } = "";
    public string AltText { get; set; } = "";
    public int SortOrder { get; set; }
}

public class Service
{
    public Guid Id { get; set; } = Guid.NewGuid();
    [Required, MaxLength(200)] public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    [MaxLength(100)] public string Icon { get; set; } = "";
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class WebsiteSection
{
    public Guid Id { get; set; } = Guid.NewGuid();
    [Required, MaxLength(100)] public string Key { get; set; } = "";
    public string Title { get; set; } = "";
    public string Subtitle { get; set; } = "";
    public string Content { get; set; } = "";
    public bool Enabled { get; set; } = true;
    public int SortOrder { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class WebsiteSetting
{
    public Guid Id { get; set; } = Guid.NewGuid();
    [Required, MaxLength(200)] public string Key { get; set; } = "";
    public string? Value { get; set; }
    [MaxLength(100)] public string Category { get; set; } = "general";
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class MediaFile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Url { get; set; } = "";
    public string FileName { get; set; } = "";
    public string FileType { get; set; } = "";
    public long FileSize { get; set; }
    public string Caption { get; set; } = "";
    public string AltText { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ThreeDModel
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = "";
    public string Url { get; set; } = "";
    public bool IsMain { get; set; }
    [Column(TypeName = "numeric(10,3)")] public decimal Scale { get; set; } = 1;
    [Column(TypeName = "numeric(10,3)")] public decimal PositionX { get; set; }
    [Column(TypeName = "numeric(10,3)")] public decimal PositionY { get; set; }
    [Column(TypeName = "numeric(10,3)")] public decimal PositionZ { get; set; }
    [Column(TypeName = "numeric(10,3)")] public decimal RotationSpeed { get; set; } = 0.3m;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ContactMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    [Required, MaxLength(200)] public string Name { get; set; } = "";
    [Required, EmailAddress, MaxLength(200)] public string Email { get; set; } = "";
    [MaxLength(50)] public string Phone { get; set; } = "";
    [MaxLength(200)] public string Subject { get; set; } = "";
    public string Message { get; set; } = "";
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class SeoSetting
{
    public Guid Id { get; set; } = Guid.NewGuid();
    [Required, MaxLength(100)] public string Page { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Keywords { get; set; } = "";
    public string OgImage { get; set; } = "";
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UserEmail { get; set; } = "";
    public string Action { get; set; } = "";
    public string Entity { get; set; } = "";
    public string EntityId { get; set; } = "";
    public string Details { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ContentVersion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Label { get; set; } = "";
    public string SnapshotJson { get; set; } = "{}";
    public string CreatedBy { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
