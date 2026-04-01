namespace ECommerce.Application.Auth.DTOs;

/// <summary>
/// Request to refresh an access token using a refresh token
/// </summary>
/// <param name="RefreshToken">Valid refresh token</param>
public record RefreshTokenRequest(string RefreshToken);
