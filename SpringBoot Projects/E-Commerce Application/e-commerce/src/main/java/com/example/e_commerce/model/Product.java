package com.example.e_commerce.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;
    private String brand;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;
    private String category;

//    @Column(name = "releaseDate")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate releaseDate;
    private boolean available;
    private int quantity;

    private String imageName;
    private String imageType;

    @Lob
    private byte[] imageData;
}