using Alamee.Api.Data;
using Alamee.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Alamee.Api.Controllers;

[ApiController]
[Route("api")]
public class ContactSeoController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly Services.AuditService _audit;
    public ContactSeoController(AppDbContext db, Services.AuditService audit) { _db = db; _audit = audit; }

    [AllowAnonymous]
    [HttpPost("contact")]
    public async Task<IActionResult> CreateMessage([FromBody] ContactMessage m)
    {
        m.Id = Guid.NewGuid();
        m.CreatedAt = DateTime.UtcNow; m.IsRead = false;
        _db.ContactMessages.Add(m);
        await _db.SaveChangesAsync();
        return Ok(new { id = m.Id, message = "Thank you — we will reply within 24 hours." });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("contact")]
    public async Task<IActionResult> ListMessages() =>
        Ok(await _db.ContactMessages.OrderByDescending(m => m.CreatedAt).Take(200).ToListAsync());

    [Authorize(Roles = "Admin")]
    [HttpPatch("contact/{id}")]
    public async Task<IActionResult> MarkRead(Guid id, [FromBody] MarkDto d)
    {
        var m = await _db.ContactMessages.FirstOrDefaultAsync(x => x.Id == id);
        if (m == null) return NotFound();
        m.IsRead = d.IsRead;
        await _db.SaveChangesAsync();
        return Ok(m);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("contact/{id}")]
    public async Task<IActionResult> DeleteMessage(Guid id)
    {
        var m = await _db.ContactMessages.FirstOrDefaultAsync(x => x.Id == id);
        if (m == null) return NotFound();
        _db.ContactMessages.Remove(m);
        await _db.SaveChangesAsync();
        await _audit.Log(User.Identity?.Name ?? "", "delete", "message", id.ToString());
        return NoContent();
    }

    [AllowAnonymous]
    [HttpGet("seo")]
    public async Task<IActionResult> GetSeo() => Ok(await _db.SeoSettings.ToListAsync());

    [Authorize(Roles = "Admin")]
    [HttpPut("seo")]
    public async Task<IActionResult> PutSeo([FromBody] SeoSetting s)
    {
        var row = await _db.SeoSettings.FirstOrDefaultAsync(x => x.Page == s.Page);
        if (row == null) { _db.SeoSettings.Add(s); }
        else { row.Title = s.Title; row.Description = s.Description; row.Keywords = s.Keywords; row.OgImage = s.OgImage; row.UpdatedAt = DateTime.UtcNow; }
        await _db.SaveChangesAsync();
        await _audit.Log(User.Identity?.Name ?? "", "update", "seo", s.Page);
        return Ok(row ?? s);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("stats")]
    public async Task<IActionResult> Stats() => Ok(new
    {
        projects = await _db.Projects.CountAsync(),
        services = await _db.Services.CountAsync(),
        messages = await _db.ContactMessages.CountAsync(),
        unread = await _db.ContactMessages.CountAsync(m => !m.IsRead),
        media = await _db.MediaFiles.CountAsync(),
        models = await _db.ThreeDModels.CountAsync(),
        recentLogs = await _db.AuditLogs.OrderByDescending(a => a.CreatedAt).Take(15).ToListAsync()
    });

    public class MarkDto { public bool IsRead { get; set; } }
}
