using Alamee.Api.Data;
using Alamee.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Alamee.Api.Controllers;

[ApiController]
public class ContentController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly Services.AuditService _audit;
    public ContentController(AppDbContext db, Services.AuditService audit) { _db = db; _audit = audit; }

    // ---------- WebsiteSettings ----------
    [AllowAnonymous]
    [HttpGet("api/settings")]
    public async Task<IActionResult> GetSettings() =>
        Ok(await _db.WebsiteSettings.OrderBy(s => s.Key).ToListAsync());

    [Authorize(Roles = "Admin")]
    [HttpPut("api/settings")]
    public async Task<IActionResult> PutSettings([FromBody] List<WebsiteSetting> items)
    {
        foreach (var it in items)
        {
            var row = await _db.WebsiteSettings.FirstOrDefaultAsync(x => x.Key == it.Key);
            if (row == null) { _db.WebsiteSettings.Add(it); }
            else { row.Value = it.Value; row.Category = it.Category; }
        }
        await _db.SaveChangesAsync();
        await _audit.Log(User.Identity?.Name ?? "", "update", "settings");
        return Ok(await _db.WebsiteSettings.ToListAsync());
    }

    // ---------- WebsiteSections ----------
    [AllowAnonymous]
    [HttpGet("api/sections")]
    public async Task<IActionResult> GetSections() =>
        Ok(await _db.WebsiteSections.OrderBy(s => s.SortOrder).ToListAsync());

    [Authorize(Roles = "Admin")]
    [HttpPost("api/sections")]
    public async Task<IActionResult> CreateSection([FromBody] WebsiteSection s)
    {
        s.Id = Guid.NewGuid();
        s.UpdatedAt = DateTime.UtcNow;
        _db.WebsiteSections.Add(s);
        await _db.SaveChangesAsync();
        await _audit.Log(User.Identity?.Name ?? "", "create", "section", s.Id.ToString());
        return CreatedAtAction(nameof(GetSections), new { }, s);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("api/sections")]
    public async Task<IActionResult> UpdateSection([FromBody] WebsiteSection s)
    {
        var row = await _db.WebsiteSections.FirstOrDefaultAsync(x => x.Id == s.Id);
        if (row == null) return NotFound();
        row.Title = s.Title; row.Subtitle = s.Subtitle; row.Content = s.Content;
        row.Enabled = s.Enabled; row.SortOrder = s.SortOrder;
        row.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        await _audit.Log(User.Identity?.Name ?? "", "update", "section", s.Id.ToString());
        return Ok(row);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("api/sections/{id}")]
    public async Task<IActionResult> DeleteSection(Guid id)
    {
        var row = await _db.WebsiteSections.FirstOrDefaultAsync(x => x.Id == id);
        if (row == null) return NotFound();
        _db.WebsiteSections.Remove(row);
        await _db.SaveChangesAsync();
        await _audit.Log(User.Identity?.Name ?? "", "delete", "section", id.ToString());
        return NoContent();
    }

    // ---------- Services ----------
    [AllowAnonymous]
    [HttpGet("api/services")]
    public async Task<IActionResult> GetServices() =>
        Ok(await _db.Services.Where(s => s.IsPublished).OrderBy(s => s.SortOrder).ToListAsync());

    [Authorize(Roles = "Admin")]
    [HttpPost("api/services")]
    public async Task<IActionResult> CreateService([FromBody] Service s)
    {
        s.Id = Guid.NewGuid();
        s.CreatedAt = DateTime.UtcNow; s.UpdatedAt = DateTime.UtcNow;
        _db.Services.Add(s);
        await _db.SaveChangesAsync();
        await _audit.Log(User.Identity?.Name ?? "", "create", "service", s.Id.ToString());
        return CreatedAtAction(nameof(GetServices), new { }, s);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("api/services/{id}")]
    public async Task<IActionResult> UpdateService(Guid id, [FromBody] Service s)
    {
        var row = await _db.Services.FirstOrDefaultAsync(x => x.Id == id);
        if (row == null) return NotFound();
        row.Title = s.Title; row.Description = s.Description; row.Icon = s.Icon;
        row.SortOrder = s.SortOrder; row.IsPublished = s.IsPublished;
        row.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        await _audit.Log(User.Identity?.Name ?? "", "update", "service", id.ToString());
        return Ok(row);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("api/services/{id}")]
    public async Task<IActionResult> DeleteService(Guid id)
    {
        var row = await _db.Services.FirstOrDefaultAsync(x => x.Id == id);
        if (row == null) return NotFound();
        _db.Services.Remove(row);
        await _db.SaveChangesAsync();
        await _audit.Log(User.Identity?.Name ?? "", "delete", "service", id.ToString());
        return NoContent();
    }
}
