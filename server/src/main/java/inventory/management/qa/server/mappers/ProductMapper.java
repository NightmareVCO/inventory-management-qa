/* (C)2025 */
package inventory.management.qa.server.mappers;

import inventory.management.qa.server.dtos.ProductRequestDTO;
import inventory.management.qa.server.dtos.ProductResponseDTO;
import inventory.management.qa.server.dtos.ProductStockResponseDTO;
import inventory.management.qa.server.dtos.ReducedProductResponseDTO;
import inventory.management.qa.server.entities.Product;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ProductMapper {
    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "olderQuantity", source = "quantity")
    Product productRequestDTOToProduct(ProductRequestDTO productRequestDTO);

    ProductResponseDTO productToProductResponseDTO(Product product);

    List<ProductResponseDTO> productsToProductResponseDTOs(List<Product> products);

    List<ReducedProductResponseDTO> productsToReducedProductResponseDTO(List<Product> products);

    ProductStockResponseDTO productStockToProductStockResponseDTO(Product product);
}
