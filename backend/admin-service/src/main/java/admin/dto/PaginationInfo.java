package admin.dto;

public record PaginationInfo(
        int currentPage,
        int pageSize,
        boolean hasNext,
        boolean hasPrevious,
        long totalElements,
        int totalPages
) {}