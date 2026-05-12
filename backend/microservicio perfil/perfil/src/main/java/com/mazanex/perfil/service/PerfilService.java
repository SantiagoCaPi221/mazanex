package com.mazanex.perfil.service;

import com.mazanex.perfil.model.Usuario;
import com.mazanex.perfil.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;

interface ProcesamientoStrategy {
    Usuario procesar(Usuario usuario, UsuarioRepository repo);
}

class RegistroConSincronizacionStrategy implements ProcesamientoStrategy {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String AUTH_SYNC_URL = "https://fullstack4-auth-production.up.railway.app/api/auth/sync-profile";

    @Override
    public Usuario procesar(Usuario usuario, UsuarioRepository repo) {
        Usuario guardado = repo.save(usuario);
        try {
            restTemplate.postForEntity(AUTH_SYNC_URL, guardado, Usuario.class);
        } catch (Exception e) {
            System.err.println("Fallo en la sincronización con Auth: " + e.getMessage());
        }
        return guardado;
    }
}

@Service
public class PerfilService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    private ProcesamientoStrategy estrategia = new RegistroConSincronizacionStrategy();

    public Usuario guardarPerfil(Usuario usuario) {
        return estrategia.procesar(usuario, usuarioRepository);
    }

    public List<Usuario> listarPerfiles() {
        return usuarioRepository.findAll();
    }

    public void eliminarPerfil(Long id) {
        usuarioRepository.deleteById(id);
    }
}
