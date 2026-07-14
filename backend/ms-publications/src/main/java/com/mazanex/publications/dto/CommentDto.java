package com.mazanex.publications.dto;
import lombok.Data;

/**
 * DTO utilizado para recibir comentarios asociados a una publicación.
 */
@Data
public class CommentDto {
    private Long authorId;
    private String authorName;
    private String authorAvatarUrl;
    private String content;
}