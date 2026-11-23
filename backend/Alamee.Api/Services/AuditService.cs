using Alamee.Api.Data;
using Alamee.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Alamee.Api.Services;

public class AuditService
{
    private readonly AppDbContext _db;
    public AuditService(AppDbContext db) => _db = db;

    public async Task Log(string userEmail, string action, string entity, string? entityId = null, string? details = null)
    {
        _db.AuditLogs.Add(new AuditLog { UserEmail = userEmail, Action = action, Entity = entity, EntityId = entityId ?? "", Details = details ?? "" });
        await _db.SaveChangesAsync();
    }
}
