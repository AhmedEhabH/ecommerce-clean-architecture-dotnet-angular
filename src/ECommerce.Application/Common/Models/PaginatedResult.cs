namespace ECommerce.Application.Common.Models;

/// <summary>
/// Paginated result containing a subset of items from a larger collection
/// </summary>
/// <typeparam name="T">Type of items in the collection</typeparam>
public class PaginatedResult<T>
{
    /// <summary>Items in the current page</summary>
    public IReadOnlyList<T> Items { get; }
    /// <summary>Total number of items across all pages</summary>
    public int TotalCount { get; }
    /// <summary>Current page number</summary>
    public int Page { get; }
    /// <summary>Number of items per page</summary>
    public int PageSize { get; }
    /// <summary>Total number of pages</summary>
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    /// <summary>Whether there is a previous page</summary>
    public bool HasPreviousPage => Page > 1;
    /// <summary>Whether there is a next page</summary>
    public bool HasNextPage => Page < TotalPages;

    public PaginatedResult(IReadOnlyList<T> items, int totalCount, int page, int pageSize)
    {
        Items = items;
        TotalCount = totalCount;
        Page = page;
        PageSize = pageSize;
    }
}
