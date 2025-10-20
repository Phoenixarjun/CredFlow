package com.project.credflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CredflowApplication {

	public static void main(String[] args) {
		SpringApplication.run(CredflowApplication.class, args);
	}

}
