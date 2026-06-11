package com.mazanex.publications.dto;
import lombok.Data;

@Data
public class CommentDto {
    private Long authorId;
    private String authorName;
    private String authorAvatarUrl;
    private String content;
}