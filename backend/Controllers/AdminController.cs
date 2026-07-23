using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .Where(u => u.Role == "User")
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.MobileNumber,
                    u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("support-persons")]
        public async Task<IActionResult> GetSupportPersons()
        {
            var supportPersons = await _context.Users
                .Where(u => u.Role == "Support")
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.MobileNumber,
                    u.Role
                })
                .ToListAsync();

            return Ok(supportPersons);
        }

        [HttpGet("tickets")]
        public async Task<IActionResult> GetAllTickets()
        {
            var tickets = await _context.Tickets
                .Include(t => t.User)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Description,
                    t.Category,
                    t.Priority,
                    t.Status,
                    t.CreatedAt,
                    t.ResolvedAt,
                    t.AssignedSupportPersonId,

                    UserName = t.User != null
                        ? t.User.Name
                        : ""
                })
                .ToListAsync();

            return Ok(tickets);
        }

        [HttpPost("create-support")]
        public async Task<IActionResult> CreateSupport(User request)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existingUser != null)
            {
                return BadRequest("Email already registered.");
            }

            var supportPerson = new User
            {
                Name = request.Name,
                Email = request.Email,
                MobileNumber = request.MobileNumber,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                    request.PasswordHash
                ),
                Role = "Support"
            };

            _context.Users.Add(supportPerson);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Support person created successfully"
            });
        }

        [HttpPut("assign-ticket/{ticketId}/{supportId}")]
        public async Task<IActionResult> AssignTicket(
            int ticketId,
            int supportId)
        {
            var ticket = await _context.Tickets.FindAsync(ticketId);

            var supportPerson = await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Id == supportId &&
                         u.Role == "Support"
                );

            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            if (supportPerson == null)
            {
                return NotFound("Support person not found.");
            }

            ticket.AssignedSupportPersonId = supportId;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Ticket assigned successfully"
            });
        }

        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (user.Role == "Admin")
            {
                return BadRequest("Cannot delete Admin user.");
            }

            if (user.Role == "Support")
            {
                var assignedTickets = await _context.Tickets
                    .Where(t => t.AssignedSupportPersonId == id)
                    .ToListAsync();
                foreach (var ticket in assignedTickets)
                {
                    ticket.AssignedSupportPersonId = null;
                }
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"{user.Role} deleted successfully"
            });
        }
    }
}