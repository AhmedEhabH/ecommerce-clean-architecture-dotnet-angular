using ECommerce.Api.Controllers;
using ECommerce.Api.Models;
using ECommerce.Application.Auth.DTOs;
using ECommerce.Application.Auth.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ECommerce.Api.Controllers;

/// <summary>
/// Authentication endpoints for user login, registration, and token management
/// </summary>
[EnableRateLimiting("auth")]
public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Authenticate user and return JWT tokens
    /// </summary>
    /// <remarks>
    /// Sample request:
    /// 
    ///     POST /api/auth/login
    ///     {
    ///         "email": "user@example.com",
    ///         "password": "SecurePass123!"
    ///     }
    /// </remarks>
    /// <param name="request">Login credentials</param>
    /// <returns>JWT access token and refresh token</returns>
    /// <response code="200">Returns authentication tokens</response>
    /// <response code="401">Invalid credentials</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            return HandleSuccess(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return HandleUnauthorized(ex.Message);
        }
    }

    /// <summary>
    /// Register a new user account
    /// </summary>
    /// <remarks>
    /// Sample request:
    /// 
    ///     POST /api/auth/register
    ///     {
    ///         "email": "newuser@example.com",
    ///         "password": "SecurePass123!",
    ///         "firstName": "John",
    ///         "lastName": "Doe",
    ///         "phoneNumber": "+1234567890"
    ///     }
    /// </remarks>
    /// <param name="request">Registration details</param>
    /// <returns>JWT tokens for the new user</returns>
    /// <response code="201">User created successfully</response>
    /// <response code="400">Validation error or user already exists</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            return HandleCreated(result);
        }
        catch (InvalidOperationException ex)
        {
            return HandleBadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Refresh an expired access token using a valid refresh token
    /// </summary>
    /// <remarks>
    /// Sample request:
    /// 
    ///     POST /api/auth/refresh-token
    ///     {
    ///         "refreshToken": "your-refresh-token-here"
    ///     }
    /// </remarks>
    /// <param name="request">Refresh token</param>
    /// <returns>New JWT tokens</returns>
    /// <response code="200">Returns new authentication tokens</response>
    /// <response code="401">Invalid or expired refresh token</response>
    [HttpPost("refresh-token")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var result = await _authService.RefreshTokenAsync(request.RefreshToken);
            return HandleSuccess(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return HandleUnauthorized(ex.Message);
        }
    }
}
