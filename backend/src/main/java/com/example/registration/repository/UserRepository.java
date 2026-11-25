package com.example.registration.repository;

import com.example.registration.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmailIgnoreCase(String email);

    List<User> findAllByOrderByIdAsc();
}
