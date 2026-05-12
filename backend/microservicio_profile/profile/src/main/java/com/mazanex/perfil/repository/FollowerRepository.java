package com.mazanex.profile.repository;

import com.mazanex.profile.model.Follower;
import com.mazanex.profile.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface FollowerRepository extends JpaRepository<Follower, Long> {
    Optional<Follower> findByFollowerAndFollowed(User follower, User followed);
    List<Follower> findByFollower(User follower);
    List<Follower> findByFollowed(User followed);
}