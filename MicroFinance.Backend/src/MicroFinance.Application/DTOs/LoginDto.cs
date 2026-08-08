namespace MicroFinance.Application.DTOs
{
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class TokenResponseDto
    {
        public string Token { get; set; }
        public string Expiration { get; set; }
        public string UserId { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
    }
}
