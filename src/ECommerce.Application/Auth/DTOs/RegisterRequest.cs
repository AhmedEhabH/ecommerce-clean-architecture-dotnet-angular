namespace ECommerce.Application.Auth.DTOs;

/// <summary>
/// Registration request for new user account
/// </summary>
/// <param name="Email">User email address</param>
/// <param name="Password">User password (minimum 6 characters)</param>
/// <param name="FirstName">User first name</param>
/// <param name="LastName">User last name</param>
/// <param name="PhoneNumber">Optional phone number</param>
public record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? PhoneNumber = null
);
