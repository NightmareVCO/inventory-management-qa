/* (C)2025 */
package inventory.management.qa.server.controllers;

import inventory.management.qa.server.services.ProductNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class ProductNotificationController {
    private final ProductNotificationService productNotificationService;

    @GetMapping("/stream")
    public SseEmitter stream(@RequestParam(required = true) String userId) {
        return productNotificationService.subscribe(userId);
    }
}
