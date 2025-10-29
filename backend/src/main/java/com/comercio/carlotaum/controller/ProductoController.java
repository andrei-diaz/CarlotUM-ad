package com.comercio.carlotaum.controller;

import com.comercio.carlotaum.entity.Producto;
import com.comercio.carlotaum.service.FileStorageService;
import com.comercio.carlotaum.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @GetMapping
    public ResponseEntity<List<Producto>> obtenerProductosActivos() {
        return ResponseEntity.ok(productoService.obtenerProductosActivos());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProducto(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerProductoPorId(id));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        return ResponseEntity.ok(productoService.crearProducto(producto));
    }
    
    @PostMapping("/{id}/imagen")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Producto> subirImagenProducto(@PathVariable Long id, 
                                                        @RequestParam("imagen") MultipartFile imagen) {
        Producto producto = productoService.obtenerProductoPorId(id);
        
        if (producto.getImagenUrl() != null) {
            fileStorageService.deleteFile(producto.getImagenUrl());
        }
        
        String imagenUrl = fileStorageService.storeFile(imagen, "productos");
        producto.setImagenUrl(imagenUrl);
        
        return ResponseEntity.ok(productoService.actualizarProducto(id, producto));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        return ResponseEntity.ok(productoService.actualizarProducto(id, producto));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.ok().build();
    }
}
