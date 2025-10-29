package com.comercio.carlotaum.service;

import com.comercio.carlotaum.entity.Pedido;
import com.comercio.carlotaum.entity.Pedido.EstadoPedido;
import com.comercio.carlotaum.entity.Producto;
import com.comercio.carlotaum.entity.Usuario;
import com.comercio.carlotaum.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class PedidoService {
    
    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Autowired
    private ProductoService productoService;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    public Pedido crearPedido(Usuario usuario, Long productoId, Integer cantidad, String notas) {
        Producto producto = productoService.obtenerProductoPorId(productoId);
        
        if (!producto.getActivo()) {
            throw new RuntimeException("El producto no está disponible");
        }
        
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setProducto(producto);
        pedido.setCantidad(cantidad);
        pedido.setTotal(producto.getPrecio().multiply(BigDecimal.valueOf(cantidad)));
        pedido.setEstado(EstadoPedido.PENDIENTE);
        pedido.setNotas(notas);
        
        return pedidoRepository.save(pedido);
    }
    
    public Pedido subirComprobante(Long pedidoId, Usuario usuario, MultipartFile comprobante) {
        Pedido pedido = obtenerPedidoPorId(pedidoId);
        
        if (!pedido.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("No autorizado");
        }
        
        if (pedido.getEstado() != EstadoPedido.PENDIENTE) {
            throw new RuntimeException("El pedido no está en estado PENDIENTE");
        }
        
        // Eliminar comprobante anterior si existe
        if (pedido.getComprobanteUrl() != null) {
            fileStorageService.deleteFile(pedido.getComprobanteUrl());
        }
        
        String comprobanteUrl = fileStorageService.storeFile(comprobante, "comprobantes");
        pedido.setComprobanteUrl(comprobanteUrl);
        pedido.setEstado(EstadoPedido.ESPERANDO_VALIDACION);
        
        return pedidoRepository.save(pedido);
    }
    
    public Pedido cambiarEstadoPedido(Long pedidoId, EstadoPedido nuevoEstado) {
        Pedido pedido = obtenerPedidoPorId(pedidoId);
        pedido.setEstado(nuevoEstado);
        
        if (nuevoEstado == EstadoPedido.ENTREGADO) {
            pedido.setFechaEntrega(LocalDateTime.now());
        }
        
        return pedidoRepository.save(pedido);
    }
    
    public List<Pedido> obtenerPedidosDeUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioIdOrderByFechaPedidoDesc(usuarioId);
    }
    
    public List<Pedido> obtenerTodosLosPedidos() {
        return pedidoRepository.findAllByOrderByFechaPedidoDesc();
    }
    
    public List<Pedido> obtenerPedidosPorEstado(EstadoPedido estado) {
        return pedidoRepository.findByEstadoOrderByFechaPedidoDesc(estado);
    }
    
    public Pedido obtenerPedidoPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }
}
