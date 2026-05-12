package com.mazanex.profile.controller;

import com.mazanex.profile.model.User;
import com.mazanex.profile.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User data) {
        User updated = profileService.updateProfile(id, data);
        return (updated != null) ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PostMapping("/sync")
    public ResponseEntity<User> sync(@RequestBody User data) {
        return ResponseEntity.ok(profileService.syncProfile(data));
    }

    @GetMapping("/list")
    public ResponseEntity<List<User>> listAll() {
        return ResponseEntity.ok(profileService.listAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        profileService.delete(id);
        return ResponseEntity.noContent().build();
    }
}