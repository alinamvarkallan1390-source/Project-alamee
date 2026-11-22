using Alamee.Api.Data;
using Alamee.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Alamee.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<Models.ApplicationUser> _users;
    private readonly AppDbContext _db;
    private readonly TokenService _tokens;
    private readonly AuditService _audit;

    public AuthController(UserManager<Models.ApplicationUser> users, AppDbContext db, TokenService tokens, AuditService audit)
    { _users = users; _db = db; _tokens = tokens; _audit = audit; }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _users.FindByNameAsync(dto.Email);
        if (user == null || !await _users.CheckPasswordAsync(user, dto.Password))
            return Unauthorized(new { error = "Invalid email or password." });
        await _audit.Log(user.Email ?? "", "login", "auth");
        var claims = new System.Security.Claims.ClaimsPrincipal(
            await _users.GetClaimsPrincipalAsync(user));
        var (token, expires) = _tokens.CreateToken(claims);
        return Ok(new { token, expiresAt = expires });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("me")]
    public IActionResult Me() => Ok(new { email = User.Identity?.Name, role = User.IsInRole("Admin") });

    public class LoginDto { public string Email { get; set; } = ""; public string Password { get; set; } = ""; }
}
