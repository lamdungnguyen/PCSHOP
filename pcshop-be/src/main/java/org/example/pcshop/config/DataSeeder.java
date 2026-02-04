package org.example.pcshop.config;

import org.example.pcshop.entity.Category;
import org.example.pcshop.entity.Product;
import org.example.pcshop.entity.Role;
import org.example.pcshop.entity.User;
import org.example.pcshop.repository.CategoryRepository;
import org.example.pcshop.repository.ProductRepository;
import org.example.pcshop.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

        private final ProductRepository productRepository;
        private final CategoryRepository categoryRepository;
        private final UserRepository userRepository;

        public DataSeeder(ProductRepository productRepository, CategoryRepository categoryRepository,
                        UserRepository userRepository) {
                this.productRepository = productRepository;
                this.categoryRepository = categoryRepository;
                this.userRepository = userRepository;
        }

        @Override
        public void run(String... args) throws Exception {
                seedUsers();
                seedData();
        }

        private void seedUsers() {
                // Admin
                Optional<User> adminOpt = userRepository.findByUsername("admin");
                if (adminOpt.isPresent()) {
                        User admin = adminOpt.get();
                        admin.setPassword("123");
                        admin.setRole(Role.ADMIN);
                        admin.setProvider("LOCAL");
                        admin.setEmail("lamdung04@gmail.com");
                        // Force update role
                        userRepository.save(admin);
                        System.out.println(">>> Updated Admin Password and Role <<<");
                } else {
                        User admin = new User();
                        admin.setUsername("admin");
                        admin.setPassword("123");
                        admin.setEmail("lamdung04@gmail.com");
                        admin.setRole(Role.ADMIN);
                        admin.setProvider("LOCAL");
                        userRepository.save(admin);
                        System.out.println(">>> Created Admin User <<<");
                }

                // User
                if (userRepository.findByUsername("user").isEmpty()) {
                        User user = new User();
                        user.setUsername("user");
                        user.setPassword("user123");
                        user.setEmail("user@pcshop.com");
                        user.setRole(Role.USER);
                        user.setProvider("LOCAL");
                        userRepository.save(user);
                }
        }

        private void seedData() {
                // --- 1. Create Parent Categories ---
                Category laptopParent = createCategory("Laptop", null);
                Category pcParent = createCategory("PC", null);
                Category componentParent = createCategory("Components", null);
                Category gearParent = createCategory("Gear", null);
                Category screenParent = createCategory("Monitor", null);

                // --- 2. Create Sub Categories ---
                // Laptop children
                Category laptopGaming = createCategory("Laptop Gaming", laptopParent);
                Category laptopOffice = createCategory("Laptop Office", laptopParent);
                Category laptopDell = createCategory("Laptop Dell", laptopParent);
                Category laptopAsus = createCategory("Laptop Asus", laptopParent);

                // PC children
                Category pcGaming = createCategory("Gaming PC", pcParent);
                Category pcWorkstation = createCategory("Workstation", pcParent);

                // Components children
                Category cpu = createCategory("CPU", componentParent);
                Category vga = createCategory("VGA", componentParent);
                Category main = createCategory("Mainboard", componentParent);
                Category ram = createCategory("RAM", componentParent);
                Category ssd = createCategory("SSD", componentParent);
                Category hdd = createCategory("HDD", componentParent);
                Category psu = createCategory("PSU", componentParent);
                Category casePc = createCategory("Case", componentParent);
                Category cool = createCategory("Cooling", componentParent);

                // Gear children
                Category mouse = createCategory("Mouse", gearParent);
                Category keyboard = createCategory("Keyboard", gearParent);
                Category headphone = createCategory("Headphone", gearParent);
                Category mousepad = createCategory("Mousepad", gearParent);
                Category chair = createCategory("Gaming Chair", gearParent);

                // Monitor children (optional hierarchy, or just keep flat under Monitor parent)
                Category monitorGaming = createCategory("Gaming Monitor", screenParent);
                Category monitorGraphic = createCategory("Graphic Monitor", screenParent);

                // --- 3. Create Products (Mapping to Leaf Categories) ---

                // --- Laptop Gaming ---
                createProduct("Laptop MSI Gaming Katana 15 B13VFK", new BigDecimal("28990000"), 10,
                                "https://www.anphatpc.com.vn/media/product/46653_laptop_msi_gaming_katana_15_b13vfk_6.jpg",
                                laptopGaming);
                createProduct("Laptop Acer Nitro 5 Tiger", new BigDecimal("21490000"), 15,
                                "https://www.anphatpc.com.vn/media/product/41887_laptop_acer_nitro_5_tiger_an515_58_52sp_nh_qfhsv_001_1.jpg",
                                laptopGaming);
                createProduct("Laptop Asus TUF Gaming F15", new BigDecimal("19990000"), 20,
                                "https://www.anphatpc.com.vn/media/product/43336_laptop_asus_tuf_gaming_f15_fx506hf_hn014w_1.jpg",
                                laptopGaming);
                // Assign to brands as well if needed, but usually products belong to one
                // primary category
                // Or we can treat "Laptop Dell" as a filter. For now, assigning to specific
                // types.

                // --- CPU ---
                createProduct("CPU Intel Core i9-14900K", new BigDecimal("14590000"), 50,
                                "https://www.anphatpc.com.vn/media/product/45045_cpu_intel_core_i9_14900k_1.jpg", cpu);
                createProduct("CPU Intel Core i7-13700K", new BigDecimal("9590000"), 50,
                                "https://www.anphatpc.com.vn/media/product/43522_cpu_intel_core_i7_13700k_1.jpg", cpu);
                createProduct("CPU AMD Ryzen 9 7950X", new BigDecimal("13990000"), 30,
                                "https://www.anphatpc.com.vn/media/product/43513_cpu_amd_ryzen_9_7950x_1.jpg", cpu);

                // --- VGA ---
                createProduct("VGA ASUS ROG Strix GeForce RTX 4090 OC", new BigDecimal("58990000"), 5,
                                "https://www.anphatpc.com.vn/media/product/43527_vga_asus_rog_strix_geforce_rtx_4090_oc.jpg",
                                vga);
                createProduct("VGA Gigabyte GeForce RTX 4060 WINDFORCE OC", new BigDecimal("7990000"), 40,
                                "https://www.anphatpc.com.vn/media/product/45232_vga_gigabyte_geforce_rtx_4060_windforce_oc_8g.jpg",
                                vga);

                // --- Mainboard ---
                createProduct("Mainboard ASUS ROG MAXIMUS Z790 HERO", new BigDecimal("16290000"), 10,
                                "https://www.anphatpc.com.vn/media/product/43588_mainboard_asus_rog_maximus_z790_hero.jpg",
                                main);

                // --- RAM ---
                createProduct("RAM Corsair Dominator Titanium 32GB (2x16GB) DDR5 6000MHz", new BigDecimal("4590000"),
                                25,
                                "https://www.anphatpc.com.vn/media/product/45091_ram_corsair_dominator_titanium_rgb_64gb_ddr5_6000mhz_white.jpg",
                                ram);
                createProduct("RAM Kingston Fury Beast RGB 16GB (2x8GB) DDR4 3200MHz", new BigDecimal("1290000"), 50,
                                "https://www.anphatpc.com.vn/media/product/39563_ram_kingston_fury_beast_rgb_16gb_2x8gb_ddr4_3200mhz_1.jpg",
                                ram);

                // --- SSD ---
                createProduct("SSD Samsung 990 PRO 1TB M.2 PCIe 4.0", new BigDecimal("2990000"), 50,
                                "https://www.anphatpc.com.vn/media/product/43555_ssd_samsung_990_pro_1tb_m2_pcie_4_0.jpg",
                                ssd);

                // --- PSU ---
                createProduct("PSU Corsair RM1000e 1000W 80 Plus Gold", new BigDecimal("3990000"), 20,
                                "https://www.anphatpc.com.vn/media/product/44933_psu_corsair_rm1000e_1000w_80_plus_gold_atx_3_0_1.jpg",
                                psu);

                // --- Case ---
                createProduct("Case NZXT H9 Flow White", new BigDecimal("4290000"), 15,
                                "https://www.anphatpc.com.vn/media/product/44055_case_nzxt_h9_flow_white_1.jpg",
                                casePc);

                // --- Monitor ---
                createProduct("Monitor LG UltraGear 27GR95QE-B OLED 2K 240Hz", new BigDecimal("19990000"), 10,
                                "https://www.anphatpc.com.vn/media/product/44458_man_hinh_lg_ultragear_27gr95qe_b_oled_2k_240hz.jpg",
                                monitorGaming);
                createProduct("Monitor ASUS TUF Gaming VG279Q1A 27 inch 165Hz", new BigDecimal("4590000"), 30,
                                "https://www.anphatpc.com.vn/media/product/38466_man_hinh_asus_tuf_gaming_vg279q1a_27_inch_fhd_ips_165hz_1ms_1.jpg",
                                monitorGaming);

                // --- Gear ---
                createProduct("Mouse Logitech G Pro X Superlight", new BigDecimal("2990000"), 100,
                                "https://www.anphatpc.com.vn/media/product/38586_chuot_logitech_g_pro_x_superlight_wireless_red_1.jpg",
                                mouse);
                createProduct("Keyboard Razer BlackWidow V4 Pro", new BigDecimal("5490000"), 20,
                                "https://www.anphatpc.com.vn/media/product/44485_ban_phim_co_razer_blackwidow_v4_pro_green_switch_1.jpg",
                                keyboard);

                System.out.println(">>> DATA CHECK/SEED COMPLETE <<<");
        }

        private Category createCategory(String name, Category parent) {
                return categoryRepository.findByName(name)
                                .map(c -> {
                                        if (c.getParent() != parent) {
                                                c.setParent(parent);
                                                return categoryRepository.save(c);
                                        }
                                        return c;
                                })
                                .orElseGet(() -> {
                                        Category c = new Category();
                                        c.setName(name);
                                        c.setParent(parent);
                                        return categoryRepository.save(c);
                                });
        }

        private void createProduct(String name, BigDecimal price, int quantity, String imageUrl, Category category) {
                if (!productRepository.findByNameContainingIgnoreCase(name).isEmpty()) {
                        return; // Product exists
                }
                Product product = new Product();
                product.setName(name);
                product.setPrice(price);
                product.setQuantity(quantity);
                product.setImageUrl(imageUrl);
                product.setCategory(category);
                productRepository.save(product);
        }
}
