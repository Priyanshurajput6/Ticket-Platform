using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TicketsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTicket(CreateTicketDto request)
        {
            var userIdValue = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (userIdValue == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdValue);

            var ticket = new Ticket
            {
                Title = request.Title,
                Description = request.Description,
                Category = request.Category,
                Priority = request.Priority,
                Status = "Open",
                CreatedAt = DateTime.UtcNow,
                UserId = userId
            };

            _context.Tickets.Add(ticket);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Ticket raised successfully",
                ticketId = ticket.Id
            });
        }

        [HttpGet("my-tickets")]
        public async Task<IActionResult> GetMyTickets()
        {
            var userIdValue = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (userIdValue == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdValue);

            var tickets = await _context.Tickets
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(tickets);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicketById(int id)
        {
            var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userIdValue == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdValue);

            var ticket = await _context.Tickets
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            if (userRole == "User" && ticket.UserId != userId)
            {
                return Forbid();
            }

            if (userRole == "Support" && ticket.AssignedSupportPersonId != userId)
            {
                return Forbid();
            }

            var supportPersonName = "";
            if (ticket.AssignedSupportPersonId.HasValue)
            {
                var support = await _context.Users.FindAsync(ticket.AssignedSupportPersonId.Value);
                supportPersonName = support?.Name ?? "";
            }

            return Ok(new
            {
                ticket.Id,
                ticket.Title,
                ticket.Description,
                ticket.Category,
                ticket.Priority,
                ticket.Status,
                ticket.CreatedAt,
                ticket.ResolvedAt,
                ticket.ResolutionMessage,
                ticket.UserId,
                UserName = ticket.User?.Name ?? "",
                ticket.AssignedSupportPersonId,
                AssignedSupportPersonName = supportPersonName
            });
        }
    }
}