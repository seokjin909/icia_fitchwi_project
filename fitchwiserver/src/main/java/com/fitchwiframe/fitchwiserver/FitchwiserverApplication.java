package com.fitchwiframe.fitchwiserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

@SpringBootApplication
public class FitchwiserverApplication {

  public static void main(String[] args) {
    SpringApplication.run(FitchwiserverApplication.class, args);
  }


}