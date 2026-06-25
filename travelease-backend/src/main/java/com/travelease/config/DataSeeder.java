package com.travelease.config;

import com.travelease.entity.Destination;
import com.travelease.entity.Role;
import com.travelease.entity.TourPackage;
import com.travelease.entity.User;
import com.travelease.repository.DestinationRepository;
import com.travelease.repository.RoleRepository;
import com.travelease.repository.TourPackageRepository;
import com.travelease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;
    private final TourPackageRepository packageRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedRoles();
        seedAdminUser();
        seedDestinations();
        seedTourPackages();
    }

    private void seedRoles() {
        if (roleRepository.count() == 0) {
            Role admin = new Role();
            admin.setName("ROLE_ADMIN");

            Role customer = new Role();
            customer.setName("ROLE_CUSTOMER");

            roleRepository.save(admin);
            roleRepository.save(customer);
            log.info("Roles seeded: ROLE_ADMIN, ROLE_CUSTOMER");
        }
    }

    private void seedTourPackages() {
        if (packageRepository.count() == 0) {
            List<Destination> destinations = destinationRepository.findAll();
            if (destinations.isEmpty()) return;

            Destination goa     = destinations.get(0);
            Destination manali  = destinations.get(1);
            Destination kerala  = destinations.get(2);
            Destination rajasthan = destinations.get(3);

            packageRepository.saveAll(java.util.List.of(
                tourPackage("Goa Beach Escape", goa,
                        new java.math.BigDecimal("12999"), 4, 20, "Beach"),
                tourPackage("Manali Snow Adventure", manali,
                        new java.math.BigDecimal("18999"), 6, 15, "Adventure"),
                tourPackage("Kerala Backwater Bliss", kerala,
                        new java.math.BigDecimal("15999"), 5, 20, "Nature"),
                tourPackage("Rajasthan Royal Tour", rajasthan,
                        new java.math.BigDecimal("21999"), 7, 12, "Cultural")
            ));
            log.info("Sample tour packages seeded");
        }
    }

    private TourPackage tourPackage(String title, Destination destination,
                                    java.math.BigDecimal price, int days,
                                    int seats, String category) {
        TourPackage p = new TourPackage();
        p.setTitle(title);
        p.setDestination(destination);
        p.setPricePerPerson(price);
        p.setDurationDays(days);
        p.setMaxSeats(seats);
        p.setAvailableSeats(seats);
        p.setCategory(category);
        return p;
    }

    private void seedDestinations() {
        if (destinationRepository.count() == 0) {
            destinationRepository.saveAll(java.util.List.of(
                destination("Goa", "India", "Beautiful beaches and vibrant nightlife"),
                destination("Manali", "India", "Snow-capped mountains and adventure sports"),
                destination("Kerala", "India", "Backwaters, spices and serene nature"),
                destination("Rajasthan", "India", "Royal palaces, forts and golden desert"),
                destination("Andaman Islands", "India", "Crystal clear waters and coral reefs")
            ));
            log.info("Sample destinations seeded");
        }
    }

    private Destination destination(String name, String country, String description) {
        Destination d = new Destination();
        d.setName(name);
        d.setCountry(country);
        d.setDescription(description);
        return d;
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail("admin@travelease.com")) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();

            User admin = new User();
            admin.setFullName("Admin User");
            admin.setEmail("admin@travelease.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(adminRole);

            userRepository.save(admin);
            log.info("Admin user seeded: admin@travelease.com / admin123");
        }
    }
}
