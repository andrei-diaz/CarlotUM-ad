package com.comercio.carlotaum.controller;

import com.comercio.carlotaum.dto.JwtResponse;
import com.comercio.carlotaum.dto.LoginRequest;
import com.comercio.carlotaum.dto.MessageResponse;
import com.comercio.carlotaum.dto.RegisterRequest;
import com.comercio.carlotaum.entity.Usuario;
import com.comercio.carlotaum.repository.UsuarioRepository;
import com.comercio.carlotaum.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getContrasena()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        Usuario usuario = (Usuario) authentication.getPrincipal();
        
        return ResponseEntity.ok(new JwtResponse(
                jwt,
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol().name()));
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        if (usuarioRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: El email ya está registrado"));
        }
        
        Usuario usuario = new Usuario();
        usuario.setNombre(registerRequest.getNombre());
        usuario.setEmail(registerRequest.getEmail());
        usuario.setTelefono(registerRequest.getTelefono());
        usuario.setContrasena(passwordEncoder.encode(registerRequest.getContrasena()));
        usuario.setRol(Usuario.Rol.USER);
        
        usuarioRepository.save(usuario);
        
        return ResponseEntity.ok(new MessageResponse("Usuario registrado exitosamente"));
    }
}
