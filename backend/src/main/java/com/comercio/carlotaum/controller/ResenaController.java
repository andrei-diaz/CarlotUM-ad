package com.comercio.carlotaum.controller;


import com.comercio.carlotaum.entity.Resena;
import com.comercio.carlotaum.entity.Usuario;
import com.comercio.carlotaum.service.ResenaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resenas")
public class ResenaController {
    
    @Autowired
    private ResenaService resenaService;
    
    @GetMapping("/publicas")
    public ResponseEntity<List<Resena>> obtenerResenasPublicas() {
        return ResponseEntity.ok(resenaService.obtenerResenasPublicas());
    }
    
    @PostMapping
    public ResponseEntity<Resena> crearResena(@AuthenticationPrincipal Usuario usuario,
                                              @Valid @RequestParam("comentario") String comentario,
                                              @RequestParam("calificacion") Integer calificacion,
                                              @RequestParam(value = "pedidoId", required = false) Long pedidoId,
                                              @RequestParam(value = "imagen", required = false) MultipartFile imagen) {
        Resena resena = resenaService.crearResena(usuario, pedidoId, comentario, calificacion, imagen);
        return ResponseEntity.ok(resena);
    }
    
    @GetMapping("/mis-resenas")
    public ResponseEntity<List<Resena>> obtenerMisResenas(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(resenaService.obtenerResenasDeUsuario(usuario.getId()));
    }
    
    @GetMapping("/admin/pendientes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Resena>> obtenerResenasPendientes() {
        return ResponseEntity.ok(resenaService.obtenerResenasPendientes());
    }
    
    @PutMapping("/{id}/aprobar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resena> aprobarResena(@PathVariable Long id) {
        return ResponseEntity.ok(resenaService.aprobarResena(id));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarResena(@PathVariable Long id) {
        resenaService.eliminarResena(id);
        return ResponseEntity.ok().build();
    }
}
