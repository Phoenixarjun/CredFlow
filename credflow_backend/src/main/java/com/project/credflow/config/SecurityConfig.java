package com.project.credflow.config;

import com.project.credflow.security.JwtAuthFilter;
import com.project.credflow.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.http.HttpMethod.GET;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Good practice to enable method-level security if needed later
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Apply CORS configuration defined in the corsConfigurationSource bean
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Disable CSRF protection (common for stateless APIs)
                .csrf(AbstractHttpConfigurer::disable)
                // Configure request authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Allow preflight OPTIONS requests for CORS
                        .requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
                        .requestMatchers(GET, "/api/plans").permitAll()

                        // Allow access to authentication endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        // Require ADMIN role for admin endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // Require CUSTOMER role for customer endpoints
                        .requestMatchers("/api/customer/**").hasRole("CUSTOMER")
                        // Temporarily permit BPO and Payment endpoints (adjust as needed)
                        .requestMatchers("/api/bpo/**").hasRole("BPO_AGENT")// TODO: Secure later with hasRole("BPO_AGENT") or specific logic
                        // Require authentication for any other request
                        .anyRequest().authenticated()
                )
                // Configure session management to be stateless (no sessions created)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Set the custom authentication provider
                .authenticationProvider(authenticationProvider()) // Call the bean method
                // Add the JWT filter before the standard username/password filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}