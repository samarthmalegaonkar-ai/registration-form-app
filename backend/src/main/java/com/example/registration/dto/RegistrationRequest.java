package com.example.registration.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegistrationRequest(
        @NotBlank(message = "First name is required.")
        @Size(max = 80, message = "First name must be 80 characters or fewer.")
        String firstName,

        @NotBlank(message = "Last name is required.")
        @Size(max = 80, message = "Last name must be 80 characters or fewer.")
        String lastName,

        @NotBlank(message = "Email is required.")
        @Email(message = "Enter a valid email address.")
        @Size(max = 254, message = "Email must be 254 characters or fewer.")
        String email,

        @NotBlank(message = "Mobile number is required.")
        @Pattern(
                regexp = "^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9][0-9\\s().-]{5,18}[0-9]$",
                message = "Enter a valid mobile number with 7–15 digits.")
        String mobileNumber) {
}
