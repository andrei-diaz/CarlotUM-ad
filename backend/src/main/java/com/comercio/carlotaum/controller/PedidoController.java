package com.comercio.carlotaum.controller;

import com.comercio.carlotaum.dto.PedidoRequest;
import com.comercio.carlotaum.entity.Pedido;
import com.comercio.carlotaum.entity.Pedido.EstadoPedido;
import com.comercio.carlotaum.entity.Usuario;
import com.comercio.carlotaum.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    
    @Autowired
    private PedidoService pedidoService;
    
    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@AuthenticationPrincipal Usuario usuario,
                                              @Valid @RequestBody PedidoRequest pedidoRequest) {
        Pedido pedido = pedidoService.crearPedido(
                usuario,
                pedidoRequest.getProductoId(),
                pedidoRequest.getCantidad(),
                pedidoRequest.getNotas(),
                pedidoRequest.getLugarEntrega()
        );
        return ResponseEntity.ok(pedido);
    }
    
    @PostMapping("/{id}/comprobante")
    public ResponseEntity<Pedido> subirComprobante(@AuthenticationPrincipal Usuario usuario,
                                                   @PathVariable Long id,
                                                   @RequestParam("comprobante") MultipartFile comprobante) {
        Pedido pedido = pedidoService.subirComprobante(id, usuario, comprobante);
        return ResponseEntity.ok(pedido);
    }
    
    @GetMapping("/mis-pedidos")
    public ResponseEntity<List<Pedido>> obtenerMisPedidos(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(pedidoService.obtenerPedidosDeUsuario(usuario.getId()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPedido(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.obtenerPedidoPorId(id));
    }
    
    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Pedido> cambiarEstado(@PathVariable Long id, 
                                                @RequestParam EstadoPedido estado) {
        return ResponseEntity.ok(pedidoService.cambiarEstadoPedido(id, estado));
    }
    
    @GetMapping("/admin/todos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Pedido>> obtenerTodosLosPedidos() {
        return ResponseEntity.ok(pedidoService.obtenerTodosLosPedidos());
    }
    
    @GetMapping("/admin/estado/{estado}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Pedido>> obtenerPedidosPorEstado(@PathVariable EstadoPedido estado) {
        return ResponseEntity.ok(pedidoService.obtenerPedidosPorEstado(estado));
    }
}
