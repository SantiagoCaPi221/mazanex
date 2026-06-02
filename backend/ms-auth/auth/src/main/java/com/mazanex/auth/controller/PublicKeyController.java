package com.mazanex.auth.controller;

import com.mazanex.auth.security.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class PublicKeyController {

    @Autowired
    private JwtProvider jwtProvider;

    @GetMapping("/publicKey")
    public ResponseEntity<String> publicKey() {
        String pem = jwtProvider.getPublicKeyPem();
        if (pem == null || pem.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(pem);
    }
}
