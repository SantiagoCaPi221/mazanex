package com.mazanex.ranking.service;

import com.mazanex.ranking.model.Score;
import com.mazanex.ranking.repository.ScoreRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias del servicio de ranking y puntuaciones.
 */
@ExtendWith(MockitoExtension.class)
class RankingServiceTest {

    @Mock
    private ScoreRepository scoreRepository;

    @InjectMocks
    private RankingService rankingService;

    @Test
    void getScoresByUserId_ShouldReturnList() {
        when(scoreRepository.findByUserId(1L)).thenReturn(Arrays.asList(new Score()));
        assertFalse(rankingService.getScoresByUserId(1L).isEmpty());
    }

    @Test
    void saveRecord_NewScore_ShouldSave() {
        when(scoreRepository.findByUserIdAndGameAndMode(1L, "Snake", "Normal"))
                .thenReturn(Optional.empty());
        when(scoreRepository.save(any(Score.class))).thenAnswer(i -> i.getArguments()[0]);

        Object result = rankingService.saveRecord(1L, "Bruno", "Snake", "Normal", 100, "url");
        assertTrue(result instanceof Score);
    }

    @Test
    void reportScore_ShouldIncrementCount() {
        Score score = new Score(1L, "Bruno", "Snake", "Normal", 100, "url");
        when(scoreRepository.findById(1L)).thenReturn(Optional.of(score));

        Map<String, Object> response = rankingService.reportScore(1L, 99L);
        
        assertEquals("REPORTED", response.get("status"));
        assertEquals(1, response.get("count"));
        verify(scoreRepository, times(1)).save(any(Score.class));
    }

    @Test
    void reportScore_ThreeStrikes_ShouldDelete() {
        Score score = new Score(1L, "Bruno", "Snake", "Normal", 100, "url");
        score.addReport(88L);
        score.addReport(99L);
        when(scoreRepository.findById(1L)).thenReturn(Optional.of(score));

        Map<String, Object> response = rankingService.reportScore(1L, 77L);
        
        assertEquals("DELETED", response.get("status"));
        verify(scoreRepository, times(1)).delete(any(Score.class));
    }

    @Test
    void reportScore_AlreadyReported_ShouldThrowException() {
        Score score = new Score(1L, "Bruno", "Snake", "Normal", 100, "url");
        score.addReport(99L);
        when(scoreRepository.findById(1L)).thenReturn(Optional.of(score));

        assertThrows(IllegalStateException.class, () -> rankingService.reportScore(1L, 99L));
    }
}