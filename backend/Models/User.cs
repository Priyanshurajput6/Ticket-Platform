namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public string MobileNumber { get; set; } = string.Empty;

        public string Role { get; set; } = "User";

        public List<Ticket> Tickets { get; set; } = new();
    }
}