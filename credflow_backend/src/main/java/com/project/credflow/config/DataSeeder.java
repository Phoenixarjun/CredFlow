package com.project.credflow.config;

import com.project.credflow.enums.RoleName;
import com.project.credflow.model.Role;
import com.project.credflow.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;


    @Override
    public void run(String... args) throws Exception {
        seedRoles();
    }

    private void seedRoles() {
        if (roleRepository.findByRoleName(RoleName.ADMIN).isEmpty()) {
            roleRepository.save(new Role(null, RoleName.ADMIN));
        }
        if (roleRepository.findByRoleName(RoleName.CUSTOMER).isEmpty()) {
            roleRepository.save(new Role(null, RoleName.CUSTOMER));
        }
        if (roleRepository.findByRoleName(RoleName.BPO_AGENT).isEmpty()) {
            roleRepository.save(new Role(null, RoleName.BPO_AGENT));
        }
    }
}