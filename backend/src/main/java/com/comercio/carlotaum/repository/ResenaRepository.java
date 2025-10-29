package com.comercio.carlotaum.repository;

import com.comercio.carlotaum.entity.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {
    List<Resena> findByAprobadaTrueOrderByFechaDesc();
    List<Resena> findByUsuarioIdOrderByFechaDesc(Long usuarioId);
    List<Resena> findByAprobadaFalseOrderByFechaDesc();
}
