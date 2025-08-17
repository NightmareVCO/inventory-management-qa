/* (C)2025 */
package inventory.management.qa.server.services;

import inventory.management.qa.server.dtos.ProductNotificationDTO;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class ProductNotificationService {
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(String userId) {
        SseEmitter emitter = new SseEmitter(0L);
        emitters.put(userId, emitter);

        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));
        emitter.onError((e) -> emitters.remove(userId));

        return emitter;
    }

    public void sendLowStockNotification(ProductNotificationDTO notification) {
        for (SseEmitter emitter : emitters.values()) {
            try {
                emitter.send(SseEmitter.event().name("low-stock").data(notification));
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        }
    }
}
