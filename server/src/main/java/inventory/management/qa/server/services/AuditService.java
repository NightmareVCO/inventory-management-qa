/* (C)2025 */
package inventory.management.qa.server.services;

import inventory.management.qa.server.entities.Category;
import inventory.management.qa.server.entities.Product;
import inventory.management.qa.server.entities.ProductRevision;
import inventory.management.qa.server.entities.RevisionInfo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.RevisionType;
import org.hibernate.envers.query.AuditEntity;
import org.hibernate.envers.query.order.AuditOrder;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private final long ONE_WEEK_MILLIS = 7 * 24 * 60 * 60 * 1000;

    @PersistenceContext private EntityManager entityManager;

    public List<ProductRevision> getAllProductRevisions(
            int pageNumber, int pageSize, Sort.Direction sortOrder) {
        AuditReader auditReader = AuditReaderFactory.get(entityManager);

        AuditOrder order =
                sortOrder == Sort.Direction.DESC
                        ? AuditEntity.revisionNumber().desc()
                        : AuditEntity.revisionNumber().asc();

        List<Object[]> revisionList =
                auditReader
                        .createQuery()
                        .forRevisionsOfEntity(Product.class, false, true)
                        .setFirstResult((pageNumber - 1) * pageSize)
                        .setMaxResults(pageSize)
                        .addOrder(order)
                        .getResultList();

        return revisionList.stream()
                .map(
                        revision -> {
                            Product product = (Product) revision[0];
                            RevisionInfo revisionInfo = (RevisionInfo) revision[1];
                            String revType = ((RevisionType) revision[2]).name();

                            return new ProductRevision(product, revType, revisionInfo);
                        })
                .toList();
    }

    public long countProductRevisions() {
        AuditReader auditReader = AuditReaderFactory.get(entityManager);

        Number count =
                (Number)
                        auditReader
                                .createQuery()
                                .forRevisionsOfEntity(Product.class, false, true)
                                .addProjection(AuditEntity.revisionNumber().count())
                                .getSingleResult();

        return count.longValue();
    }

    public long countProductsAddedLastWeek() {
        AuditReader auditReader = AuditReaderFactory.get(entityManager);

        Number count =
                (Number)
                        auditReader
                                .createQuery()
                                .forRevisionsOfEntity(Product.class, false, true)
                                .addProjection(AuditEntity.id().count())
                                .add(AuditEntity.revisionType().eq(RevisionType.ADD))
                                .add(AuditEntity.revisionProperty("timestamp").ge(System.currentTimeMillis() - ONE_WEEK_MILLIS))
                                .getSingleResult();

        return count.longValue();
    }

    public long countProductsDeletedLastWeek() {
        AuditReader auditReader = AuditReaderFactory.get(entityManager);

        Number count =
                (Number)
                        auditReader
                                .createQuery()
                                .forRevisionsOfEntity(Product.class, false, true)
                                .addProjection(AuditEntity.id().count())
                                .add(AuditEntity.revisionType().eq(RevisionType.DEL))
                                .add(AuditEntity.revisionProperty("timestamp").ge(System.currentTimeMillis() - ONE_WEEK_MILLIS))
                                .getSingleResult();

        return count.longValue();
    }

    public Map<String, Long> getValueOfDispatchedProductsByCategory() {
        String query =
                "SELECT p.category, COALESCE(SUM(p.price), 0) " +
                        "FROM product_logs p " +
                        "JOIN revision_info r ON p.rev = r.id " +
                        "WHERE p.revtype = ? " +
                        "GROUP BY p.category";

        List<Object[]> results = entityManager.createNativeQuery(query)
                .setParameter(1, RevisionType.MOD.ordinal())
                .getResultList();

        Map<String, Long> categoryValues = new HashMap<>();

        for (Object[] result : results) {
            String categoryName = (String) result[0];
            Number value = (Number) result[1];
            categoryValues.put(categoryName, value.longValue());
        }

        for (Category category : Category.values()) {
            categoryValues.putIfAbsent(category.name(), 0L);
        }

        return categoryValues;
    }

    public List<Product> getTopProductsWithMostModifications() {
        String query =
                "SELECT p.id, COUNT(p.id) " +
                        "FROM product_logs p " +
                        "WHERE p.revtype = ? " +
                        "GROUP BY p.id " +
                        "ORDER BY COUNT(p.id) DESC";

        List<Object[]> countResults = entityManager.createNativeQuery(query)
                .setParameter(1, RevisionType.MOD.ordinal())
                .setMaxResults(5)
                .getResultList();

        return countResults.stream()
                .map(result -> {
                    Number id = (Number) result[0];
                    return entityManager.find(Product.class, id.longValue());
                })
                .filter(Objects::nonNull)
                .toList();
    }
}
