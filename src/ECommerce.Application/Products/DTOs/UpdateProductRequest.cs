namespace ECommerce.Application.Products.DTOs;

/// <summary>
/// Request to update an existing product (only provided fields will be updated)
/// </summary>
/// <param name="Name">New product name</param>
/// <param name="Description">New product description</param>
/// <param name="Price">New product price</param>
/// <param name="CompareAtPrice">New compare-at price</param>
/// <param name="LowStockThreshold">New low stock threshold</param>
/// <param name="IsFeatured">New featured status</param>
public record UpdateProductRequest(
    string? Name = null,
    string? Description = null,
    decimal? Price = null,
    decimal? CompareAtPrice = null,
    int? LowStockThreshold = null,
    bool? IsFeatured = null
);
