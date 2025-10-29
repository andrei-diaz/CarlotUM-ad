package com.comercio.carlotaum.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResenaRequest {
    private Long pedidoId;
    
    @NotBlank(message = "Comentario es requerido")
    private String comentario;
    
    @NotNull(message = "Calificación es requerida")
    @Min(value = 1, message = "Calificación debe ser al menos 1")
    @Max(value = 5, message = "Calificación debe ser máximo 5")
    private Integer calificacion;
}
