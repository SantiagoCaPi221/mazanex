package com.mazanex.publications.dto;
import lombok.Data;

/**
 * DTO utilizado para crear publicaciones desde el cliente.
 */
@Data
public class PublicationDto {
    private Long authorId;
    private String authorName;
    private String authorAvatarUrl;
    private String content;
    private String mediaUrl;
}