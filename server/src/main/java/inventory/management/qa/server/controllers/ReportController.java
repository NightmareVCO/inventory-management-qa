package inventory.management.qa.server.controllers;

import inventory.management.qa.server.dtos.ProductResponseDTO;
import inventory.management.qa.server.dtos.ProductsReportDTO;
import inventory.management.qa.server.entities.Product;
import inventory.management.qa.server.mappers.ProductMapper;
import inventory.management.qa.server.services.AuditService;
import inventory.management.qa.server.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('admin') or hasRole('employee')")
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final AuditService auditService;
    private final ProductService productService;

    @GetMapping("/products")
    public ResponseEntity<ProductsReportDTO> getProductsReport(){
        List<Product> topProductsWithMostModifications = auditService.getTopProductsWithMostModifications();

        List<ProductResponseDTO> topProductsWithMostModificationsDTO =
                ProductMapper.INSTANCE.productsToProductResponseDTOs(topProductsWithMostModifications);

        ProductsReportDTO productsReportDTO = new ProductsReportDTO(
                productService.countByQuantityLessThanMinStock(),
                auditService.countProductsAddedLastWeek(),
                auditService.countProductsDeletedLastWeek(),
                topProductsWithMostModificationsDTO,
                auditService.getValueOfDispatchedProductsByCategory()
        );

        return new ResponseEntity<>(productsReportDTO, HttpStatus.OK);
    }
}
