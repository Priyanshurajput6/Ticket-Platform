namespace backend.Models
{
    public class Ticket
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string Priority { get; set; } = "Low";

        public string Status { get; set; } = "Open";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ResolvedAt { get; set; }

        public string? ResolutionMessage { get; set; }

        public int UserId { get; set; }

        public User? User { get; set; }

        public int? AssignedSupportPersonId { get; set; }
    }
}