package com.example.registration.service;

import com.example.registration.dto.RegistrationRequest;
import com.example.registration.dto.UserResponse;
import com.example.registration.entity.User;
import com.example.registration.exception.DuplicateEmailException;
import com.example.registration.repository.UserRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse register(RegistrationRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new DuplicateEmailException();
        }

        User user = new User(
                request.firstName().trim(),
                request.lastName().trim(),
                normalizedEmail,
                request.mobileNumber().trim());

        try {
            return toResponse(userRepository.saveAndFlush(user));
        } catch (DataIntegrityViolationException exception) {
            throw new DuplicateEmailException();
        }
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAllByOrderByIdAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getMobileNumber());
    }
}
