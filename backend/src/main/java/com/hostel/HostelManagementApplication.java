package com.hostel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Hostel & Mess Management System — Spring Boot Application.
 * <p>
 * Profiles:
 *   default  → H2 in-memory database (zero-config demo)
 *   mysql    → MySQL / MariaDB (set DB_* env vars)
 */
@SpringBootApplication
public class HostelManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(HostelManagementApplication.class, args);
    }
}
