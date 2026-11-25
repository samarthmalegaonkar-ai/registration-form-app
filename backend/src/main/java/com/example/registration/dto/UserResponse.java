package com.example.registration.dto;

public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        String mobileNumber) {
}
