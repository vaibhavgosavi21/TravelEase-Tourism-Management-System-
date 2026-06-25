package com.travelease.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DestinationResponse {
    private Long id;
    private String name;
    private String country;
    private String description;
    private String imageUrl;
}
