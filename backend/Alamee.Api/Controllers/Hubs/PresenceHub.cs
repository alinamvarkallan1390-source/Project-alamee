using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Alamee.Api.Controllers.Hubs;

[Authorize(Roles = "Admin")]
public class PresenceHub : Hub
{
    public override Task OnConnectedAsync()
    {
        Clients.All.SendAsync("presence", "admin-online");
        return base.OnConnectedAsync();
    }
}
