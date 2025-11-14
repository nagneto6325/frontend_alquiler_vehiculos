import { Component, OnInit } from '@angular/core';

/**
 * Componente principal de la aplicación que gestiona la navegación
 * y el estado general del sistema de alquiler de vehículos
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /**
   * Título de la aplicación
   */
  titulo = 'Sistema de Alquiler de Vehículos';

  /**
   * Estado de autenticación del usuario
   */
  estaAutenticado = false;

  /**
   * Sección actualmente activa en la aplicación
   */
  seccionActual = 'dashboard';

  /**
   * Estado de la barra lateral (colapsada o expandida)
   */
  sidebarCollapsed = false;

  /**
   * Información del usuario actualmente autenticado
   */
  usuarioActual: any = null;

  /**
   * Estadísticas del sistema para el dashboard
   */
  estadisticas = {
    vehiculosDisponibles: 0,
    contratosActivos: 0,
    ingresosMes: 0,
    mantenimientosPendientes: 0
  };

  /**
   * Lista de actividad reciente para el dashboard
   */
  actividadReciente: any[] = [];

  /**
   * Inicializa el componente y verifica el estado de autenticación
   */
  ngOnInit(): void {
    this.verificarAutenticacion();
    this.cargarEstadisticasIniciales();
  }

  /**
   * Verifica si el usuario está autenticado revisando el almacenamiento local
   */
  verificarAutenticacion(): void {
    const token = localStorage.getItem('authToken');
    const usuario = localStorage.getItem('userData');
    
    if (token && usuario) {
      this.estaAutenticado = true;
      this.usuarioActual = JSON.parse(usuario);
    }
  }

  /**
   * Maneja el evento de login exitoso
   * @param datosUsuario Datos del usuario que ha iniciado sesión
   */
  onLoginExitoso(datosUsuario: any): void {
    this.estaAutenticado = true;
    this.usuarioActual = datosUsuario.usuario;
    this.cargarEstadisticasIniciales();
  }

  /**
   * Cambia la sección activa de la aplicación
   * @param seccion Nombre de la sección a activar
   */
  cambiarSeccion(seccion: string): void {
    this.seccionActual = seccion;
  }

  /**
   * Navega a una sección específica desde las tarjetas del dashboard
   * @param seccion Nombre de la sección a la que navegar
   */
  navegarDesdeDashboard(seccion: string): void {
    this.cambiarSeccion(seccion);
  }

  /**
   * Alterna el estado de la barra lateral (colapsar/expandir)
   */
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  /**
   * Cierra la sesión del usuario actual
   */
  cerrarSesion(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.estaAutenticado = false;
    this.usuarioActual = null;
    this.seccionActual = 'dashboard';
  }

  /**
   * Carga las estadísticas iniciales del sistema
   */
  cargarEstadisticasIniciales(): void {
    if (this.estaAutenticado) {
      this.simularCargaEstadisticas();
    }
  }

  /**
   * Simula la carga de estadísticas desde el backend
   */
  private simularCargaEstadisticas(): void {
    setTimeout(() => {
      this.estadisticas = {
        vehiculosDisponibles: 12,
        contratosActivos: 8,
        ingresosMes: 2500000,
        mantenimientosPendientes: 3
      };

      this.actividadReciente = [
        {
          fecha: new Date(),
          tipo: 'Contrato',
          descripcion: 'Nuevo contrato creado',
          usuario: this.usuarioActual?.username || 'Sistema',
          claseBadge: 'bg-primary'
        },
        {
          fecha: new Date(Date.now() - 3600000),
          tipo: 'Pago',
          descripcion: 'Pago registrado exitosamente',
          usuario: this.usuarioActual?.username || 'Sistema',
          claseBadge: 'bg-success'
        },
        {
          fecha: new Date(Date.now() - 7200000),
          tipo: 'Mantenimiento',
          descripcion: 'Mantenimiento programado',
          usuario: 'Sistema',
          claseBadge: 'bg-warning'
        }
      ];
    }, 1000);
  }
}