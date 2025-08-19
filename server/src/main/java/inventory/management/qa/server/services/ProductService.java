/* (C)2025 */
package inventory.management.qa.server.services;

import inventory.management.qa.server.dtos.ProductNotificationDTO;
import inventory.management.qa.server.entities.Product;
import inventory.management.qa.server.exception.EntityNotFoundException;
import inventory.management.qa.server.repositories.ProductRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductNotificationService productNotificationService;

    public Product create(Product product) {
        return productRepository.save(product);
    }

    public Page<Product> getProducts(Specification<Product> specification, Pageable pageable) {
        return productRepository.findAll(specification, pageable);
    }

    public Product findById(Long id) {
        return productRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
    }

    public Product update(Long id, Product product) {
        Product existingProduct = findById(id);

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setOlderQuantity(existingProduct.getQuantity());
        existingProduct.setQuantity(product.getQuantity());
        existingProduct.setMinStock(product.getMinStock());

        if (isLowStock(existingProduct)) {
            notifyLowStock(existingProduct);
        }

        return productRepository.save(existingProduct);
    }

    public Product updateStock(Long id, int quantity) {
        Product existingProduct = findById(id);

        existingProduct.setQuantity(quantity);

        if (isLowStock(existingProduct)) {
            notifyLowStock(existingProduct);
        }

        return productRepository.save(existingProduct);
    }

    private boolean isLowStock(Product product) {
        return product.getQuantity() <= product.getMinStock();
    }

    private void notifyLowStock(Product product) {
        UUID uuid = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();
        String notificationType = "low-stock";

        ProductNotificationDTO productNotificationDTO =
                new ProductNotificationDTO(
                        uuid,
                        notificationType,
                        product.getId(),
                        product.getName(),
                        product.getQuantity(),
                        product.getMinStock(),
                        now);

        productNotificationService.sendLowStockNotification(productNotificationDTO);
    }

    public Product delete(Long id) {
        Product existingProduct = findById(id);
        productRepository.delete(existingProduct);

        return existingProduct;
    }

    public long countByQuantityLessThanMinStock() {
        return productRepository.countByQuantityLessThanMinStock();
    }
}
