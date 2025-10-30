package com.comercio.carlotaum.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pedidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Pedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore
    private Usuario usuario;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;
    
    @Column(nullable = false)
    private Integer cantidad;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estado = EstadoPedido.PENDIENTE;
    
    @Column(name = "comprobante_url")
    private String comprobanteUrl;
    
    @Column(name = "fecha_pedido", nullable = false)
    private LocalDateTime fechaPedido;
    
    @Column(name = "fecha_entrega")
    private LocalDateTime fechaEntrega;
    
    @Column(columnDefinition = "TEXT")
    private String notas;
    
    @Column(name = "lugar_entrega", nullable = false)
    private String lugarEntrega;
    
    @PrePersist
    protected void onCreate() {
        fechaPedido = LocalDateTime.now();
    }
    
    public enum EstadoPedido {
        PENDIENTE,            // Pedido creado, esperando comprobante
        ESPERANDO_VALIDACION, // Comprobante subido, esperando validación admin
        CONFIRMADO,           // Pago validado por admin, preparando pedido
        ENTREGADO,            // Entregado al cliente
        CANCELADO             // Cancelado
    }
}
