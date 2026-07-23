using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using backend.Data;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Support")]
    public class SupportController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SupportController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("assigned-tickets")]
        public async Task<IActionResult> GetAssignedTickets()
        {
            var supportIdValue = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (supportIdValue == null)
            {
                return Unauthorized();
            }

            int supportId = int.Parse(supportIdValue);

            var tickets = await _context.Tickets
                .Where(t => t.AssignedSupportPersonId == supportId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(tickets);
        }

        [HttpPut("start/{ticketId}")]
        public async Task<IActionResult> StartTicket(int ticketId)
        {
            var supportId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var ticket = await _context.Tickets
                .FirstOrDefaultAsync(t =>
                    t.Id == ticketId &&
                    t.AssignedSupportPersonId == supportId
                );

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            ticket.Status = "Working In Progress";

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Ticket is now Working In Progress"
            });
        }

        [HttpPut("close/{ticketId}")]
        public async Task<IActionResult> CloseTicket(
            int ticketId,
            [FromBody] string resolutionMessage)
        {
            var supportId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var ticket = await _context.Tickets
                .FirstOrDefaultAsync(t =>
                    t.Id == ticketId &&
                    t.AssignedSupportPersonId == supportId
                );

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            ticket.Status = "Closed";
            ticket.ResolutionMessage = resolutionMessage;
            ticket.ResolvedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Ticket closed successfully"
            });
        }
    }
}