package com.comercio.carlotaum.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PedidoRequest {
    @NotNull(message = "Producto ID es requerido")
    private Long productoId;
    
    @NotNull(message = "Cantidad es requerida")
    @Min(value = 1, message = "Cantidad debe ser al menos 1")
    private Integer cantidad;
    
    private String notas;
}
