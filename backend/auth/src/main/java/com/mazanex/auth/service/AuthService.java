package com.mazanex.auth.service;

import com.mazanex.auth.model.Usuario;
import com.mazanex.auth.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

class UsuarioFactory {
    public static Usuario crearCliente(String nombre, String email, String password) {
        Usuario u = new Usuario();
        u.setNombre(nombre);
        u.setEmail(email);
        u.setPassword(password);
        u.setRol("CLIENTE");
        return u;
    }
}

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario login(String identificador, String password) {
        return validarCredenciales(identificador, password);
    }

    public Usuario registrarOActualizar(Usuario data) {
        return usuarioRepository.findByEmail(data.getEmail())
                .map(existente -> {
                    existente.setNombre(data.getNombre());
                    return usuarioRepository.save(existente);
                })
                .orElseGet(() -> {
                    Usuario nuevo = UsuarioFactory.crearCliente(data.getNombre(), data.getEmail(), data.getPassword());
                    return usuarioRepository.save(nuevo);
                });
    }

    public boolean eliminar(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Usuario registrarUsuario(Usuario usuario) {
        if (usuario.getRol() == null || usuario.getRol().isEmpty()) {
            usuario.setRol("USER");
        }
        return usuarioRepository.save(usuario);
    }

    public Usuario validarCredenciales(String identificador, String password) {
        return usuarioRepository.findByEmail(identificador)
                .or(() -> usuarioRepository.findByNombre(identificador))
                .filter(u -> u.getPassword().equals(password))
                .orElse(null);
    }
}
