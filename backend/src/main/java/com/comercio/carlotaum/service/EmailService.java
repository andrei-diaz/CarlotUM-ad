package com.comercio.carlotaum.service;

import com.comercio.carlotaum.entity.Pedido;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${app.admin.email:admin@carlotaum.com}")
    private String adminEmail;
    
    public void enviarNotificacionNuevoPedido(Pedido pedido) {
        if (mailSender == null) {
            // Si no está configurado el email, solo log
            System.out.println("=== NOTIFICACIÓN DE NUEVO PEDIDO ===");
            System.out.println("Pedido ID: " + pedido.getId());
            System.out.println("Cliente: " + pedido.getUsuario().getNombre());
            System.out.println("Producto: " + pedido.getProducto().getNombre());
            System.out.println("Cantidad: " + pedido.getCantidad());
            System.out.println("Total: $" + pedido.getTotal());
            System.out.println("Lugar de entrega: " + pedido.getLugarEntrega());
            System.out.println("Estado: " + pedido.getEstado());
            System.out.println("====================================");
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(adminEmail);
            message.setSubject("🍽️ Nuevo Pedido #" + pedido.getId() + " - CarlotaUm");
            message.setText(construirMensajePedido(pedido));
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error al enviar email: " + e.getMessage());
        }
    }
    
    public void enviarNotificacionPagoValidado(Pedido pedido) {
        if (mailSender == null) {
            System.out.println("=== PAGO VALIDADO ===");
            System.out.println("Pedido ID: " + pedido.getId());
            System.out.println("Cliente: " + pedido.getUsuario().getEmail());
            System.out.println("=====================");
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(pedido.getUsuario().getEmail());
            message.setSubject("✅ Pago Confirmado - Pedido #" + pedido.getId());
            message.setText(construirMensajePagoConfirmado(pedido));
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error al enviar email: " + e.getMessage());
        }
    }
    
    private String construirMensajePedido(Pedido pedido) {
        return String.format(
            "¡Nuevo pedido recibido!\n\n" +
            "📋 Detalles del Pedido:\n" +
            "Pedido ID: #%d\n" +
            "Cliente: %s\n" +
            "Email: %s\n" +
            "Teléfono: %s\n\n" +
            "🍽️ Producto:\n" +
            "Nombre: %s\n" +
            "Cantidad: %d\n" +
            "Total: $%.2f\n\n" +
            "📍 Lugar de entrega: %s\n\n" +
            "💳 Estado del pago: %s\n\n" +
            "%s\n\n" +
            "Revisa el panel de administración para más detalles.",
            pedido.getId(),
            pedido.getUsuario().getNombre(),
            pedido.getUsuario().getEmail(),
            pedido.getUsuario().getTelefono(),
            pedido.getProducto().getNombre(),
            pedido.getCantidad(),
            pedido.getTotal(),
            pedido.getLugarEntrega(),
            pedido.getEstado(),
            pedido.getNotas() != null ? "Notas: " + pedido.getNotas() : ""
        );
    }
    
    private String construirMensajePagoConfirmado(Pedido pedido) {
        return String.format(
            "¡Hola %s!\n\n" +
            "Tu pago ha sido confirmado exitosamente. ✅\n\n" +
            "📋 Detalles de tu pedido:\n" +
            "Pedido ID: #%d\n" +
            "Producto: %s\n" +
            "Cantidad: %d\n" +
            "Total: $%.2f\n" +
            "Lugar de entrega: %s\n\n" +
            "Tu pedido está siendo preparado. Te notificaremos cuando esté listo para recoger.\n\n" +
            "¡Gracias por tu compra!\n" +
            "CarlotaUm",
            pedido.getUsuario().getNombre(),
            pedido.getId(),
            pedido.getProducto().getNombre(),
            pedido.getCantidad(),
            pedido.getTotal(),
            pedido.getLugarEntrega()
        );
    }
}
