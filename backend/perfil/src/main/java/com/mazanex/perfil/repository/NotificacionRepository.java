package com.mazanex.perfil.repository;

import com.mazanex.perfil.model.Notificacion;
import com.mazanex.perfil.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByUsuarioDestinoOrderByFechaDesc(Usuario usuarioDestino);
}
