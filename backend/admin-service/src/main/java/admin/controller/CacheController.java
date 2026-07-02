package admin.controller;

import admin.service.CacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/cache")
@RestController
public class CacheController {

    @Autowired
    private CacheService cacheService;

    @PostMapping("/clear-all")
    public ResponseEntity<String> clearAllCaches() {
        try {
            cacheService.evictAllCaches();
            return ResponseEntity.ok("All caches cleared");
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/clear/{cacheName}")
    public ResponseEntity<String> clearCache(@PathVariable String cacheName) {
        try {
            cacheService.evictCacheByName(cacheName);
            return ResponseEntity.ok("Cache " + cacheName + " cleared");
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
