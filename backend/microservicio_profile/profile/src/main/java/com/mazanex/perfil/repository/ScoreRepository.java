package com.mazanex.profile.repository;

import com.mazanex.profile.model.Score;
import com.mazanex.profile.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
    List<Score> findByUser(User user);
    Optional<Score> findByUserAndGameAndMode(User user, String game, String mode);
    List<Score> findByGameOrderByHighScoreDesc(String game);
}