using Alamee.Api.Data;
using Alamee.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Alamee.Api.Controllers;

[ApiController]
[Route("api/projects")]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly Services.AuditService _audit;
    public ProjectsController(AppDbContext db, Services.AuditService audit) { _db = db; _audit = audit; }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> List([FromQuery] bool published = true)
    {
        var q = _db.Projects.Include(p => p.Images).AsQueryable();
        if (published) q = q.Where(p => p.IsPublished);
        return Ok(await q.OrderBy(p => p.SortOrder).ToListAsync());
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Project dto)
    {
        dto.Id = Guid.NewGuid();
        dto.CreatedAt = DateTime.UtcNow;
        dto.UpdatedAt = DateTime.UtcNow;
        _db.Projects.Add(dto);
        await _db.SaveChangesAsync();
        await _audit.Log(User.Identity?.Name ?? "", "create", "project", dto.Id.ToString());
        return CreatedAtAction(nameof(List), new { }, dto);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Project dto)
    {
        var p = await _db.Projects.Include(x => x.Images).FirstOrDefaultAsync(x => x.Id == id);
        if (p == null) return NotFound();
        p.Title = dto.Title; p.Slug = dto.Slug; p.Description = dto.Description;
        p.Location = dto.Location; p.Category = dto.Category; p.Status = dto.Status;
        p.CompletionDate = dto.CompletionDate; p.AreaSqm = dto.AreaSqm;
        p.Floors = dto.Floors; p.Units = dto.Units; p.CoverImage = dto.CoverImage;
        p.ModelUrl = dto.ModelUrl; p.IsPublished = dto.IsPublished; p.SortOrder = dto.SortOrder;
        p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        await _audit.Log(User.Identity?.Name ?? "", "update", "project", id.ToString());
        return Ok(p);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var p = await _db.Projects.FirstOrDefaultAsync(x => x.Id == id);
        if (p == null) return NotFound();
        _db.Projects.Remove(p);
        await _db.SaveChangesAsync();
        await _audit.Log(User.Identity?.Name ?? "", "delete", "project", id.ToString());
        return NoContent();
    }
}
