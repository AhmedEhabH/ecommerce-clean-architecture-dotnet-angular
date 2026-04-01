namespace ECommerce.Application.Categories.DTOs;

/// <summary>
/// Request to create a new category
/// </summary>
/// <param name="Name">Category name</param>
/// <param name="Slug">URL-friendly slug</param>
/// <param name="Description">Optional category description</param>
/// <param name="ParentId">Optional parent category ID for subcategories</param>
/// <param name="IconUrl">Optional icon URL</param>
/// <param name="DisplayOrder">Display order (default: 0)</param>
public record CreateCategoryRequest(
    string Name,
    string Slug,
    string? Description = null,
    Guid? ParentId = null,
    string? IconUrl = null,
    int DisplayOrder = 0
);
