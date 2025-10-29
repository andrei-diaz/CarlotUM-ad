package com.comercio.carlotaum.service;

import com.comercio.carlotaum.entity.Pedido;
import com.comercio.carlotaum.entity.Resena;
import com.comercio.carlotaum.entity.Usuario;
import com.comercio.carlotaum.repository.ResenaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Transactional
public class ResenaService {
    
    @Autowired
    private ResenaRepository resenaRepository;
    
    @Autowired
    private PedidoService pedidoService;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    public Resena crearResena(Usuario usuario, Long pedidoId, String comentario, 
                              Integer calificacion, MultipartFile imagen) {
        Resena resena = new Resena();
        resena.setUsuario(usuario);
        resena.setComentario(comentario);
        resena.setCalificacion(calificacion);
        
        if (pedidoId != null) {
            Pedido pedido = pedidoService.obtenerPedidoPorId(pedidoId);
            resena.setPedido(pedido);
        }
        
        if (imagen != null && !imagen.isEmpty()) {
            String imagenUrl = fileStorageService.storeFile(imagen, "resenas");
            resena.setImagenUrl(imagenUrl);
        }
        
        return resenaRepository.save(resena);
    }
    
    public List<Resena> obtenerResenasPublicas() {
        return resenaRepository.findByAprobadaTrueOrderByFechaDesc();
    }
    
    public List<Resena> obtenerResenasPendientes() {
        return resenaRepository.findByAprobadaFalseOrderByFechaDesc();
    }
    
    public List<Resena> obtenerResenasDeUsuario(Long usuarioId) {
        return resenaRepository.findByUsuarioIdOrderByFechaDesc(usuarioId);
    }
    
    public Resena aprobarResena(Long resenaId) {
        Resena resena = resenaRepository.findById(resenaId)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));
        resena.setAprobada(true);
        return resenaRepository.save(resena);
    }
    
    public void eliminarResena(Long resenaId) {
        Resena resena = resenaRepository.findById(resenaId)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));
        
        if (resena.getImagenUrl() != null) {
            fileStorageService.deleteFile(resena.getImagenUrl());
        }
        
        resenaRepository.delete(resena);
    }
}
