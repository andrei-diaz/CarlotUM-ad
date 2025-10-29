package com.comercio.carlotaum.repository;

import com.comercio.carlotaum.entity.Pedido;
import com.comercio.carlotaum.entity.Pedido.EstadoPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioIdOrderByFechaPedidoDesc(Long usuarioId);
    List<Pedido> findByEstadoOrderByFechaPedidoDesc(EstadoPedido estado);
    List<Pedido> findAllByOrderByFechaPedidoDesc();
}
