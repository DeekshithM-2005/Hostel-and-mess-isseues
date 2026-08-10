package com.hostel.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

/**
 * Web configurations — maps static resources like image uploads so
 * they can be served by Tomcat.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${upload.dir:./uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String path = Paths.get(uploadDir).toAbsolutePath().toUri().toString();
        
        // Expose local upload folder under /uploads/** path
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(path);
    }
}
