/* (C)2025 */
package inventory.management.qa.server.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Value;

@Value
public class ProductNotificationDTO {
    UUID uuid;
    String type;
    Long productId;
    String productName;
    int quantity;
    int threshold;
    LocalDateTime timestamp;
}
