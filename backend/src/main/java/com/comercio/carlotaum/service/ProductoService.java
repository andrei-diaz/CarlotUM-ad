package com.comercio.carlotaum.service;

import com.comercio.carlotaum.entity.Producto;
import com.comercio.carlotaum.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    public List<Producto> obtenerTodosLosProductos() {
        return productoRepository.findAll();
    }
    
    public List<Producto> obtenerProductosActivos() {
        // Retorna solo productos activos con stock mayor a 0
        return productoRepository.findByActivoTrueAndStockDisponibleGreaterThan(0);
    }
    
    public Producto obtenerProductoPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }
    
    public Producto crearProducto(Producto producto) {
        return productoRepository.save(producto);
    }
    
    public Producto actualizarProducto(Long id, Producto productoActualizado) {
        Producto producto = obtenerProductoPorId(id);
        producto.setNombre(productoActualizado.getNombre());
        producto.setDescripcion(productoActualizado.getDescripcion());
        producto.setPrecio(productoActualizado.getPrecio());
        producto.setImagenUrl(productoActualizado.getImagenUrl());
        producto.setActivo(productoActualizado.getActivo());
        return productoRepository.save(producto);
    }
    
    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id);
    }
    
    public Producto guardarProducto(Producto producto) {
        return productoRepository.save(producto);
    }
}
