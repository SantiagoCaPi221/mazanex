package com.mazanex.auth.dto;

public class loginresponse {

    private String token;
    private Long id;
    private String name;
    private String role;

    public loginresponse(String token, Long id, String name, String role) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }
}