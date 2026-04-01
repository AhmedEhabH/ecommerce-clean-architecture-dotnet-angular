using ECommerce.Api.Controllers;
using ECommerce.Api.Models;
using ECommerce.Application.Payments.DTOs;
using ECommerce.Application.Payments.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Controllers;

[Authorize]
public class PaymentsController : BaseApiController
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> InitiatePayment([FromBody] CreatePaymentRequest request, CancellationToken cancellationToken)
    {
        var result = await _paymentService.CreatePaymentAsync(request, cancellationToken);
        if (result.IsFailure)
            return HandleBadRequest(result.Error ?? "Failed to initiate payment");
        return HandleCreated(result.Value, "Payment initiated successfully");
    }

    [HttpGet("{paymentId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> GetPayment(Guid paymentId, CancellationToken cancellationToken)
    {
        var result = await _paymentService.GetPaymentByIdAsync(paymentId, cancellationToken);
        if (result.IsFailure)
            return HandleNotFound(result.Error ?? "Payment not found");
        return HandleSuccess(result.Value);
    }

    [HttpGet("order/{orderId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> GetPaymentByOrder(Guid orderId, CancellationToken cancellationToken)
    {
        var result = await _paymentService.GetPaymentByOrderIdAsync(orderId, cancellationToken);
        if (result.IsFailure)
            return HandleNotFound(result.Error ?? "Payment not found for this order");
        return HandleSuccess(result.Value);
    }

    [HttpPost("{paymentId:guid}/process")]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> ProcessPayment(Guid paymentId, [FromBody] ProcessPaymentRequest? request, CancellationToken cancellationToken)
    {
        var result = await _paymentService.ProcessPaymentAsync(paymentId, request?.ProviderReference, cancellationToken);
        if (result.IsFailure)
            return HandleBadRequest(result.Error ?? "Failed to process payment");
        return HandleSuccess(result.Value, "Payment processed successfully");
    }

    [HttpPost("{paymentId:guid}/refund")]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> RefundPayment(Guid paymentId, [FromBody] RefundPaymentRequest? request, CancellationToken cancellationToken)
    {
        var result = await _paymentService.RefundPaymentAsync(paymentId, request?.RefundAmount, request?.Reason, cancellationToken);
        if (result.IsFailure)
            return HandleBadRequest(result.Error ?? "Failed to refund payment");
        return HandleSuccess(result.Value, "Payment refunded successfully");
    }
}