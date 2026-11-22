using Alamee.Api.Data;
using Alamee.Api.Models;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Alamee.Api.Controllers;

[ApiController]
[Route("api/versions")]
[Authorize(Roles = "Admin")]
public class VersionsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly Services.AuditService _audit;
    public VersionsController(AppDbContext db, Services.AuditService audit) { _db = db; _audit = audit; }

    [HttpGet]
    public async Task<IActionResult> List() =>
        Ok(await _db.ContentVersions.OrderByDescending(v => v.CreatedAt).ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Publish([FromBody] PublishDto dto)
    {
        var snap = new ContentVersion
        {
            Label = dto.Label,
            SnapshotJson = JsonSerializer.Serialize(new
            {
                settings = await _db.WebsiteSettings.ToListAsync(),
                sections = await _db.WebsiteSections.ToListAsync(),
                projects = await _db.Projects.ToListAsync(),
                services = await _db.Services.ToListAsync(),
                seo = await _db.SeoSettings.ToListAsync()
            }),
            CreatedBy = User.Identity?.Name ?? ""
        };
        _db.ContentVersions.Add(snap);
        await _db.SaveChangesAsync();
        await _audit.Log(User.Identity?.Name ?? "", "publish", "version", snap.Id.ToString());
        return Ok(snap);
    }

    [HttpPost("rollback")]
    public async Task<IActionResult> Rollback([FromBody] RollbackDto dto)
    {
        var snap = await _db.ContentVersions.FirstOrDefaultAsync(v => v.Id == dto.Id);
        if (snap == null) return NotFound();

        var data = JsonSerializer.Deserialize<JsonElement>(snap.SnapshotJson);

        // Clear current content and restore from snapshot.
        await _db.WebsiteSettings.ExecuteDeleteAsync();
        await _db.WebsiteSections.ExecuteDeleteAsync();
        await _db.SeoSettings.ExecuteDeleteAsync();

        foreach (var el in data.GetProperty("settings").EnumerateArray())
        {
            _db.WebsiteSettings.Add(new WebsiteSetting
            {
                Id = el.GetProperty("id").GetGuid(),
                Key = el.GetProperty("key").GetString() ?? "",
                Value = el.TryGetProperty("value", out var v) ? v.GetString() : null,
                Category = el.TryGetProperty("category", out var c) ? c.GetString() ?? "general" : "general"
            });
        }
        foreach (var el in data.GetProperty("sections").EnumerateArray())
        {
            _db.WebsiteSections.Add(new WebsiteSection
            {
                Id = el.GetProperty("id").GetGuid(),
                Key = el.GetProperty("key").GetString() ?? "",
                Title = el.TryGetProperty("title", out var t) ? t.GetString() ?? "" : "",
                Subtitle = el.TryGetProperty("subtitle", out var st) ? st.GetString() ?? "" : "",
                Content = el.TryGetProperty("content", out var ct) ? ct.GetString() ?? "" : "",
                Enabled = el.TryGetProperty("enabled", out var en) && en.GetBoolean(),
                SortOrder = el.TryGetProperty("sortOrder", out var so) ? so.GetInt32() : 0
            });
        }
        foreach (var el in data.GetProperty("seo").EnumerateArray())
        {
            _db.SeoSettings.Add(new SeoSetting
            {
                Id = el.GetProperty("id").GetGuid(),
                Page = el.GetProperty("page").GetString() ?? "",
                Title = el.TryGetProperty("title", out var t) ? t.GetString() ?? "" : "",
                Description = el.TryGetProperty("description", out var d) ? d.GetString() ?? "" : "",
                Keywords = el.TryGetProperty("keywords", out var k) ? k.GetString() ?? "" : "",
                OgImage = el.TryGetProperty("ogImage", out var o) ? o.GetString() ?? "" : ""
            });
        }
        await _db.SaveChangesAsync();
        await _audit.Log(User.Identity?.Name ?? "", "rollback", "version", snap.Id.ToString());
        return Ok(new { message = "Rollback executed." });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var v = await _db.ContentVersions.FirstOrDefaultAsync(x => x.Id == id);
        if (v == null) return NotFound();
        _db.ContentVersions.Remove(v);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    public class PublishDto { public string Label { get; set; } = ""; }
    public class RollbackDto { public Guid Id { get; set; } }
}
