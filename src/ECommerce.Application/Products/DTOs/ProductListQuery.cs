namespace ECommerce.Application.Products.DTOs;

/// <summary>
/// Query parameters for filtering and paginating product listings
/// </summary>
/// <param name="Page">Page number (default: 1)</param>
/// <param name="PageSize">Items per page (default: 20)</param>
/// <param name="SearchTerm">Search term for name/description</param>
/// <param name="CategoryId">Filter by category ID</param>
/// <param name="VendorId">Filter by vendor ID</param>
/// <param name="IsFeatured">Filter by featured status</param>
/// <param name="IsActive">Filter by active status</param>
/// <param name="IsInStock">Filter by stock availability</param>
/// <param name="MinPrice">Minimum price filter</param>
/// <param name="MaxPrice">Maximum price filter</param>
/// <param name="SortBy">Field to sort by (name, price, createdAt, etc.)</param>
/// <param name="SortDescending">Sort in descending order (default: false)</param>
public record ProductListQuery(
    int Page = 1,
    int PageSize = 20,
    string? SearchTerm = null,
    Guid? CategoryId = null,
    Guid? VendorId = null,
    bool? IsFeatured = null,
    bool? IsActive = null,
    bool? IsInStock = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    string? SortBy = null,
    bool SortDescending = false
);
