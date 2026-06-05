package com.mazanex.auth.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtProvider {

    @Value("${jwt.privateKey:}")
    private String privateKeyPem;

    @Value("${jwt.publicKey:}")
    private String publicKeyPem;

    @Value("${jwt.privateKeyPath:}")
    private String privateKeyPath;

    @Value("${jwt.publicKeyPath:}")
    private String publicKeyPath;

    @Value("${jwt.secret:}")
    private String jwtSecret;

    @Value("${jwt.expirationMs:3600000}")
    private long expirationMs;

    private PrivateKey privateKey;
    private PublicKey publicKey;
    private byte[] secretKey;

    private synchronized void ensureKeysLoaded() {
        if ((privateKey != null && publicKey != null) || secretKey != null) return;
        try {
            String privPem = privateKeyPem;
            String pubPem = publicKeyPem;
            if ((privPem == null || privPem.isEmpty()) && privateKeyPath != null && !privateKeyPath.isEmpty()) {
                if (privateKeyPath.startsWith("classpath:")) {
                    String res = privateKeyPath.substring("classpath:".length());
                    InputStream is = getClass().getResourceAsStream(res);
                    privPem = new String(is.readAllBytes());
                } else {
                    privPem = Files.readString(Path.of(privateKeyPath));
                }
            }
            if ((pubPem == null || pubPem.isEmpty()) && publicKeyPath != null && !publicKeyPath.isEmpty()) {
                if (publicKeyPath.startsWith("classpath:")) {
                    String res = publicKeyPath.substring("classpath:".length());
                    InputStream is = getClass().getResourceAsStream(res);
                    pubPem = new String(is.readAllBytes());
                } else {
                    pubPem = Files.readString(Path.of(publicKeyPath));
                }
            }

            if (privPem != null && !privPem.isEmpty()) {
                privateKey = readPrivateKeyFromPem(privPem);
            }
            if (pubPem != null && !pubPem.isEmpty()) {
                publicKey = readPublicKeyFromPem(pubPem);
            }

            if ((privateKey == null || publicKey == null) && jwtSecret != null && !jwtSecret.isEmpty()) {
                secretKey = jwtSecret.getBytes(StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to load JWT keys", e);
        }
    }

    private PrivateKey readPrivateKeyFromPem(String pem) throws Exception {
        String s = pem.replaceAll("-----BEGIN (.*)-----", "")
                .replaceAll("-----END (.*)----", "")
                .replaceAll("\n", "").replaceAll("\r", "");
        byte[] decoded = Base64.getDecoder().decode(s);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePrivate(spec);
    }

    private PublicKey readPublicKeyFromPem(String pem) throws Exception {
        String s = pem.replaceAll("-----BEGIN (.*)-----", "")
                .replaceAll("-----END (.*)----", "")
                .replaceAll("\n", "").replaceAll("\r", "");
        byte[] decoded = Base64.getDecoder().decode(s);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(decoded);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePublic(spec);
    }

    public String generateToken(String subject) {
        ensureKeysLoaded();
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);

        JwtBuilder builder = Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(exp);

        if (privateKey != null) {
            return builder.signWith(SignatureAlgorithm.RS256, privateKey).compact();
        }
        if (secretKey != null) {
            SecretKeySpec signingKey = new SecretKeySpec(secretKey, SignatureAlgorithm.HS256.getJcaName());
            return builder.signWith(SignatureAlgorithm.HS256, signingKey).compact();
        }
        throw new IllegalStateException("JWT signing configuration is missing");
    }

    public String getSubjectFromToken(String token) {
        Claims claims = parseClaims(token);
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException | SignatureException | MalformedJwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        ensureKeysLoaded();
        JwtParser parser = Jwts.parser();
        if (publicKey != null) {
            parser.setSigningKey(publicKey);
        } else if (secretKey != null) {
            parser.setSigningKey(secretKey);
        } else {
            throw new IllegalStateException("JWT validation configuration is missing");
        }
        return parser.parseClaimsJws(token).getBody();
    }

    public String getPublicKeyPem() {
        if (publicKeyPem != null && !publicKeyPem.isEmpty()) return publicKeyPem;
        if (publicKeyPath != null && !publicKeyPath.isEmpty()) {
            try {
                if (publicKeyPath.startsWith("classpath:")) {
                    String res = publicKeyPath.substring("classpath:".length());
                    InputStream is = getClass().getResourceAsStream(res);
                    return new String(is.readAllBytes());
                } else {
                    return Files.readString(Path.of(publicKeyPath));
                }
            } catch (Exception e) {
                return "";
            }
        }
        return "";
    }
}
