package inventory.management.qa.server;

import inventory.management.qa.server.dtos.ProductNotificationDTO;
import inventory.management.qa.server.entities.Category;
import inventory.management.qa.server.entities.Product;
import inventory.management.qa.server.exception.EntityNotFoundException;
import inventory.management.qa.server.repositories.ProductRepository;
import inventory.management.qa.server.services.ProductNotificationService;
import inventory.management.qa.server.services.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductNotificationService productNotificationService;

    @InjectMocks
    private ProductService productService;

    private Product product;
    private Product updatedProduct;

    @BeforeEach
    void setUp() {
        product = createTestProduct();
        updatedProduct = createUpdatedTestProduct();
    }

    private Product createTestProduct() {
        Product testProduct = new Product();

        testProduct.setId(1L);
        testProduct.setName("Test Product");
        testProduct.setDescription("Test Description");
        testProduct.setCategory(Category.ELECTRONICS);
        testProduct.setPrice(99.99);
        testProduct.setQuantity(100);
        testProduct.setMinStock(10);

        return testProduct;
    }

    private Product createUpdatedTestProduct() {
        Product updateTestdProduct = new Product();

        updateTestdProduct.setName("Updated Product");
        updateTestdProduct.setDescription("Updated Description");
        updateTestdProduct.setCategory(Category.ELECTRONICS);
        updateTestdProduct.setPrice(80.99);
        updateTestdProduct.setQuantity(50);
        updateTestdProduct.setMinStock(5);

        return updateTestdProduct;
    }

    @Test
    void create_ShouldSaveAndReturnProduct() {
        when(productRepository.save(product)).thenReturn(product);

        Product result = productService.create(product);

        assertNotNull(result);
        assertEquals(product.getName(), result.getName());
        verify(productRepository).save(product);
    }

    @Test
    void findById_ShouldReturnProduct_WhenExists() {
        when(productRepository.findById(1L)).thenReturn(java.util.Optional.of(product));

        Product result = productService.findById(1L);

        assertNotNull(result);
        assertEquals(product.getName(), result.getName());
        verify(productRepository).findById(1L);

        when(productRepository.findById(2L)).thenReturn(java.util.Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> productService.findById(2L));
    }

    @Test
    void update_ShouldUpdateAndReturnProduct_WhenExists() {
        when(productRepository.findById(1L)).thenReturn(java.util.Optional.of(product));
        when(productRepository.save(product)).thenReturn(product);

        int olderQuantity = product.getQuantity();
        Product result = productService.update(1L, updatedProduct);

        assertNotNull(result);
        assertEquals(updatedProduct.getName(), result.getName());
        assertEquals(updatedProduct.getDescription(), result.getDescription());
        assertEquals(updatedProduct.getCategory(), result.getCategory());
        assertEquals(updatedProduct.getPrice(), result.getPrice());
        assertEquals(updatedProduct.getQuantity(), result.getQuantity());
        assertEquals(updatedProduct.getMinStock(), result.getMinStock());
        assertEquals(olderQuantity, result.getOlderQuantity());

        verify(productRepository).findById(1L);
        verify(productRepository).save(product);
    }

    @Test
    void delete_ShouldDeleteProductAndReturnDeletedEntity_WhenExists() {
        when(productRepository.findById(1L)).thenReturn(java.util.Optional.of(product))
                                            .thenReturn(java.util.Optional.empty());

        Product deletedProduct = productService.delete(1L);

        assertNotNull(deletedProduct);
        assertEquals(product.getId(), deletedProduct.getId());
        verify(productRepository).findById(1L);
        verify(productRepository).delete(product);

        assertThrows(EntityNotFoundException.class, () -> productService.findById(1L));
        verify(productRepository, times(2)).findById(1L);
    }

    @Test
    void updateStock_ShouldUpdateQuantityAndReturnProduct() {
        when(productRepository.findById(1L)).thenReturn(java.util.Optional.of(product));
        when(productRepository.save(product)).thenReturn(product);

        int newQuantity = 20;
        Product result = productService.updateStock(1L, newQuantity);

        assertNotNull(result);
        assertEquals(newQuantity, result.getQuantity());
        verify(productRepository).findById(1L);
        verify(productRepository).save(product);
    }

    @Test
    void updateStock_ShouldNotifyWhenStockIsLow() {
        when(productRepository.findById(1L)).thenReturn(java.util.Optional.of(product));
        when(productRepository.save(product)).thenReturn(product);

        int lowQuantity = product.getMinStock() - 1;
        Product result = productService.updateStock(1L, lowQuantity);

        assertNotNull(result);
        assertEquals(lowQuantity, result.getQuantity());
        verify(productRepository).findById(1L);
        verify(productRepository).save(product);
        verify(productNotificationService).sendLowStockNotification(any(ProductNotificationDTO.class));
    }

    @Test
    void updateStock_ShouldNotNotifyWhenStockIsNotLow() {
        when(productRepository.findById(1L)).thenReturn(java.util.Optional.of(product));
        when(productRepository.save(product)).thenReturn(product);

        int highQuantity = product.getMinStock() + 10;
        Product result = productService.updateStock(1L, highQuantity);

        assertNotNull(result);
        assertEquals(highQuantity, result.getQuantity());
        verify(productRepository).findById(1L);
        verify(productRepository).save(product);
        verify(productNotificationService, never()).sendLowStockNotification(any(ProductNotificationDTO.class));
    }
}
