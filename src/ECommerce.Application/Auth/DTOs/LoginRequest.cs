namespace ECommerce.Application.Auth.DTOs;

/// <summary>
/// Login request with user credentials
/// </summary>
/// <param name="Email">User email address</param>
/// <param name="Password">User password</param>
public record LoginRequest(string Email, string Password);
