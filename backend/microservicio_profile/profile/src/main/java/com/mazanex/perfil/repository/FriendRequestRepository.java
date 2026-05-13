package com.mazanex.profile.repository;

import com.mazanex.profile.model.FriendRequest;
import com.mazanex.profile.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    
    boolean existsBySenderAndReceiver(User sender, User receiver);
    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver);

    // Métodos basados en ID necesarios para el nuevo SocialService
    Optional<FriendRequest> findBySenderIdAndReceiverId(Long senderId, Long receiverId);
    boolean existsBySenderIdAndReceiverId(Long senderId, Long receiverId);
}
