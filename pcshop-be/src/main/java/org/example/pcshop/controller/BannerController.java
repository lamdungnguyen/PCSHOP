package org.example.pcshop.controller;

import org.example.pcshop.entity.Banner;
import org.example.pcshop.service.BannerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@CrossOrigin(origins = "http://localhost:5173")
public class BannerController {
    private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @GetMapping
    public List<Banner> getAll() {
        return bannerService.getAllBanners(); // Admin view
    }

    @GetMapping("/active")
    public List<Banner> getActive() {
        return bannerService.getActiveBanners(); // Public view
    }

    @PostMapping
    public Banner create(@RequestBody Banner banner) {
        return bannerService.saveBanner(banner);
    }

    @PutMapping("/{id}")
    public Banner update(@PathVariable Long id, @RequestBody Banner banner) {
        banner.setId(id);
        return bannerService.saveBanner(banner);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        bannerService.deleteBanner(id);
    }
}
