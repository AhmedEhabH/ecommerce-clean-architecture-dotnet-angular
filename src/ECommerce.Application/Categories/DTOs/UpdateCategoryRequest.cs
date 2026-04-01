namespace ECommerce.Application.Categories.DTOs;

/// <summary>
/// Request to update an existing category (only provided fields will be updated)
/// </summary>
/// <param name="Name">New category name</param>
/// <param name="Description">New category description</param>
/// <param name="IconUrl">New icon URL</param>
/// <param name="DisplayOrder">New display order</param>
public record UpdateCategoryRequest(
    string? Name = null,
    string? Description = null,
    string? IconUrl = null,
    int? DisplayOrder = null
);
