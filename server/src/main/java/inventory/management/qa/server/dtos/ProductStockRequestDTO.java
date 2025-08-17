/* (C)2025 */
package inventory.management.qa.server.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Value;

@Value
public class ProductStockRequestDTO {
    @NotNull(message = "Product quantity is required") Integer quantity;
}
