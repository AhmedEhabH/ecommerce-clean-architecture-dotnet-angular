using ECommerce.Api.Controllers;
using ECommerce.Application.Common.Models;
using ECommerce.Application.Payments.DTOs;
using ECommerce.Application.Payments.Interfaces;
using ECommerce.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;

namespace ECommerce.Api.Tests.Controllers;

public class PaymentsControllerTests
{
    private readonly Mock<IPaymentService> _mockPaymentService;
    private readonly PaymentsController _controller;

    public PaymentsControllerTests()
    {
        _mockPaymentService = new Mock<IPaymentService>();
        _controller = new PaymentsController(_mockPaymentService.Object);
    }

    [Fact]
    public async Task InitiatePayment_ShouldReturnCreated_WhenPaymentIsSuccessful()
    {
        // Arrange
        var request = new CreatePaymentRequest(
            Guid.NewGuid(),
            PaymentMethod.CreditCard,
            "stripe",
            100.00m,
            "USD");

        var paymentDto = new PaymentDto(
            Guid.NewGuid(),
            request.OrderId,
            request.Method.ToString(),
            request.Provider,
            null,
            "pending",
            request.Amount,
            request.Currency,
            null,
            null,
            DateTime.UtcNow,
            null);

        _mockPaymentService
            .Setup(x => x.CreatePaymentAsync(request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(ECommerce.Application.Common.Models.Result<PaymentDto>.Success(paymentDto));

        // Act
        var result = await _controller.InitiatePayment(request, CancellationToken.None);

        // Assert
        var createdResult = result.Should().BeOfType<CreatedResult>().Subject;
        createdResult.StatusCode.Should().Be(201);
        createdResult.Value.Should().NotBeNull();
        _mockPaymentService.Verify(x => x.CreatePaymentAsync(request, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetPayment_ShouldReturnOk_WhenPaymentExists()
    {
        // Arrange
        var paymentId = Guid.NewGuid();
        var paymentDto = new PaymentDto(
            paymentId,
            Guid.NewGuid(),
            PaymentMethod.CreditCard.ToString(),
            "stripe",
            null,
            "pending",
            100.00m,
            "USD",
            null,
            null,
            DateTime.UtcNow,
            null);

        _mockPaymentService
            .Setup(x => x.GetPaymentByIdAsync(paymentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(ECommerce.Application.Common.Models.Result<PaymentDto>.Success(paymentDto));

        // Act
        var result = await _controller.GetPayment(paymentId, CancellationToken.None);

        // Assert
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.StatusCode.Should().Be(200);
        okResult.Value.Should().NotBeNull();
        _mockPaymentService.Verify(x => x.GetPaymentByIdAsync(paymentId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetPaymentByOrder_ShouldReturnOk_WhenPaymentExists()
    {
        // Arrange
        var orderId = Guid.NewGuid();
        var paymentDto = new PaymentDto(
            Guid.NewGuid(),
            orderId,
            PaymentMethod.CreditCard.ToString(),
            "stripe",
            null,
            "pending",
            100.00m,
            "USD",
            null,
            null,
            DateTime.UtcNow,
            null);

        _mockPaymentService
            .Setup(x => x.GetPaymentByOrderIdAsync(orderId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(ECommerce.Application.Common.Models.Result<PaymentDto>.Success(paymentDto));

        // Act
        var result = await _controller.GetPaymentByOrder(orderId, CancellationToken.None);

        // Assert
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.StatusCode.Should().Be(200);
        okResult.Value.Should().NotBeNull();
        _mockPaymentService.Verify(x => x.GetPaymentByOrderIdAsync(orderId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ProcessPayment_ShouldReturnOk_WhenPaymentIsProcessed()
    {
        // Arrange
        var paymentId = Guid.NewGuid();
        var providerReference = "ch_1234567890";
        var paymentDto = new PaymentDto(
            paymentId,
            Guid.NewGuid(),
            PaymentMethod.CreditCard.ToString(),
            "stripe",
            providerReference,
            "completed",
            100.00m,
            "USD",
            null,
            DateTime.UtcNow,
            DateTime.UtcNow,
            DateTime.UtcNow);

        _mockPaymentService
            .Setup(x => x.ProcessPaymentAsync(paymentId, providerReference, It.IsAny<CancellationToken>()))
            .ReturnsAsync(ECommerce.Application.Common.Models.Result<PaymentDto>.Success(paymentDto));

        // Act
        var result = await _controller.ProcessPayment(paymentId, new ProcessPaymentRequest(paymentId, providerReference, null), CancellationToken.None);

        // Assert
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.StatusCode.Should().Be(200);
        okResult.Value.Should().NotBeNull();
        _mockPaymentService.Verify(x => x.ProcessPaymentAsync(paymentId, providerReference, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task RefundPayment_ShouldReturnOk_WhenPaymentIsRefunded()
    {
        // Arrange
        var paymentId = Guid.NewGuid();
        var paymentDto = new PaymentDto(
            paymentId,
            Guid.NewGuid(),
            PaymentMethod.CreditCard.ToString(),
            "stripe",
            "ch_1234567890",
            "refunded",
            100.00m,
            "USD",
            null,
            DateTime.UtcNow,
            DateTime.UtcNow,
            DateTime.UtcNow);

        _mockPaymentService
            .Setup(x => x.RefundPaymentAsync(paymentId, 50.00m, "Customer requested refund", It.IsAny<CancellationToken>()))
            .ReturnsAsync(ECommerce.Application.Common.Models.Result<PaymentDto>.Success(paymentDto));

        // Act
        var result = await _controller.RefundPayment(paymentId, new RefundPaymentRequest(paymentId, 50.00m, "Customer requested refund"), CancellationToken.None);

        // Assert
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.StatusCode.Should().Be(200);
        okResult.Value.Should().NotBeNull();
        _mockPaymentService.Verify(x => x.RefundPaymentAsync(paymentId, 50.00m, "Customer requested refund", It.IsAny<CancellationToken>()), Times.Once);
    }
}