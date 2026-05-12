package com.mazanex.profile.repository;

import com.mazanex.profile.model.FriendRequest;
import com.mazanex.profile.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    
    // El booleano que faltaba para validar antes de enviar
    boolean existsBySenderAndReceiver(User sender, User receiver);

    // Para buscar la solicitud específica al momento de aceptar o rechazar
    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver);
}