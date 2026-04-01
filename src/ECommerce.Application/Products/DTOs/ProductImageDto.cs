namespace ECommerce.Application.Products.DTOs;

/// <summary>
/// Product image data transfer object
/// </summary>
/// <param name="Id">Unique image identifier</param>
/// <param name="ImageUrl">URL of the product image</param>
/// <param name="AltText">Alternative text for accessibility</param>
/// <param name="DisplayOrder">Display order among product images</param>
public record ProductImageDto(
    Guid Id,
    string ImageUrl,
    string? AltText,
    int DisplayOrder
);
