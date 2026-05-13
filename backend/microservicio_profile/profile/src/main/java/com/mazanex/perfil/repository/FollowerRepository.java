package com.mazanex.profile.repository;

import com.mazanex.profile.model.Follower;
import com.mazanex.profile.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FollowerRepository extends JpaRepository<Follower, Long> {

    // Verifica si ya existe la relación para evitar duplicados en la tabla
    boolean existsByFollowerAndFollowed(User follower, User followed);

    // Busca la relación específica para poder eliminarla (Unfriend)
    Optional<Follower> findByFollowerAndFollowed(User follower, User followed);

    // Lista todos los seguidos por un usuario específico
    List<Follower> findByFollower(User follower);
}
