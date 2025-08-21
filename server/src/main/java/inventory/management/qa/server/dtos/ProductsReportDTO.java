/* (C)2025 */
package inventory.management.qa.server.dtos;

import lombok.Value;

import java.util.List;
import java.util.Map;

@Value
public class ProductsReportDTO {
    long totalProductsWithMinStock;
    long totalProductsAddedLastWeek;
    long totalProductsDeletedLastWeek;
    List<ProductResponseDTO> topProductsWithMostModifications;
    Map<String, Long> valueOfDispatchedProductsByCategory;
}
