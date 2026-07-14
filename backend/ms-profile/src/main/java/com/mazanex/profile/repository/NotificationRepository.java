package com.mazanex.profile.repository;

import com.mazanex.profile.model.Notification;
import com.mazanex.profile.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repositorio para acceder a las notificaciones del microservicio de perfiles.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByTargetUserOrderByDateDesc(User targetUser);
}