using Alamee.Api.Data;
using Alamee.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alamee.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize(Roles = "Admin")]
public class UploadController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly Services.AuditService _audit;
    public UploadController(AppDbContext db, Services.AuditService audit) { _db = db; _audit = audit; }

    private static (string Type, bool IsModel) Validate(string fileType, string fileName, long size, long maxImage, long maxModel)
    {
        var isModel = fileType.Contains("glb") || fileType.Contains("gltf") || fileName.EndsWith(".glb") || fileName.EndsWith(".gltf");
        var max = isModel ? maxModel : maxImage;
        if (size > max) throw new BadHttpRequestException("File too large.");
        if (!isModel && !(fileType.StartsWith("image/"))) throw new BadHttpRequestException("Only images and GLB/GLTF models are allowed.");
        return (fileType, isModel);
    }

    [HttpPost("media")]
    public IActionResult Media([FromBody] MediaUploadDto dto)
    {
        var (type, _) = Validate(dto.FileType, dto.FileName, dto.FileSize, 10_485_760, 104_857_600);
        var m = new MediaFile { Url = dto.Url, FileName = dto.FileName, FileType = type, FileSize = dto.FileSize };
        _db.MediaFiles.Add(m);
        _db.SaveChanges();
        _audit.Log(User.Identity?.Name ?? "", "create", "media", m.Id.ToString());
        return Ok(m);
    }

    [HttpPost("models")]
    public IActionResult Model([FromBody] ModelUploadDto dto)
    {
        Validate(dto.FileType, dto.FileName, dto.FileSize, 10_485_760, 104_857_600);
        if (dto.IsMain)
        {
            foreach (var old in _db.ThreeDModels.Where(x => x.IsMain)) { old.IsMain = false; }
        }
        var m = new ThreeDModel
        {
            Name = dto.Name, Url = dto.Url, IsMain = dto.IsMain, Scale = dto.Scale,
            PositionX = dto.PositionX, PositionY = dto.PositionY, PositionZ = dto.PositionZ,
            RotationSpeed = dto.RotationSpeed
        };
        _db.ThreeDModels.Add(m);
        _db.SaveChanges();
        _audit.Log(User.Identity?.Name ?? "", "create", "model", m.Id.ToString());
        return Ok(m);
    }

    public class MediaUploadDto { public string Url { get; set; } = ""; public string FileName { get; set; } = ""; public string FileType { get; set; } = ""; public long FileSize { get; set; } }
    public class ModelUploadDto
    {
        public string Name { get; set; } = ""; public string Url { get; set; } = "";
        public string FileName { get; set; } = ""; public string FileType { get; set; } = "";
        public long FileSize { get; set; } public bool IsMain { get; set; }
        public decimal Scale { get; set; } = 1; public decimal PositionX { get; set; }
        public decimal PositionY { get; set; } public decimal PositionZ { get; set; }
        public decimal RotationSpeed { get; set; } = 0.3m;
    }
}
