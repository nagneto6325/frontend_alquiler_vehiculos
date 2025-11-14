import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MantenimientosService } from '../../services/mantenimientos.service';
import { VehiculosService } from '../../services/vehiculos.service';
import { ContratosService } from '../../services/contratos.service';

@Component({
  selector: 'app-gestion-mantenimientos',
  templateUrl: './gestion-mantenimientos.component.html',
  styleUrls: ['./gestion-mantenimientos.component.css']
})
export class GestionMantenimientosComponent implements OnInit {
  mantenimientos: any[] = [];
  vehiculos: any[] = [];
  contratos: any[] = [];
  mantenimientoSeleccionado: any = null;
  nuevoMantenimiento = {
    vehiculo_id: '',
    contrato_id: '',
    tipo: 'Limpieza',
    descripcion: '',
    costo: 0,
    fecha_solicitud: new Date().toISOString().slice(0, 16),
    fecha_completado: '',
    estado: 'Pendiente'
  };
  cargando = false;
  mensaje = '';
  mostrarModal = false;
  tiposMantenimiento = [
    'Limpieza',
    'Revisión General',
    'Cambio de Aceite',
    'Reparación Mecánica',
    'Reparación Eléctrica',
    'Cambio de Neumáticos',
    'Alineación y Balanceo',
    'Otro'
  ];
  estadosMantenimiento = ['Pendiente', 'En Proceso', 'Completado', 'Cancelado'];

  constructor(
    private mantenimientosService: MantenimientosService,
    private vehiculosService: VehiculosService,
    private contratosService: ContratosService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    
    Promise.all([
      this.mantenimientosService.obtenerMantenimientos().toPromise(),
      this.vehiculosService.obtenerVehiculos().toPromise(),
      this.contratosService.obtenerContratos().toPromise()
    ]).then(([mantenimientos, vehiculos, contratos]) => {
      this.mantenimientos = mantenimientos || [];
      this.vehiculos = vehiculos || [];
      this.contratos = contratos || [];
      this.cargando = false;
      this.cdRef.detectChanges();
    }).catch(error => {
      this.mensaje = 'Error al cargar datos: ' + error.message;
      this.cargando = false;
      this.cdRef.detectChanges();
    });
  }

  abrirModalNuevo(): void {
    this.mantenimientoSeleccionado = null;
    this.nuevoMantenimiento = {
      vehiculo_id: '',
      contrato_id: '',
      tipo: 'Limpieza',
      descripcion: '',
      costo: 0,
      fecha_solicitud: new Date().toISOString().slice(0, 16),
      fecha_completado: '',
      estado: 'Pendiente'
    };
    this.mostrarModal = true;
    this.mensaje = '';
  }

  abrirModalEditar(mantenimiento: any): void {
    this.mantenimientoSeleccionado = { 
      ...mantenimiento,
      fecha_solicitud: new Date(mantenimiento.fecha_solicitud).toISOString().slice(0, 16),
      fecha_completado: mantenimiento.fecha_completado ? 
        new Date(mantenimiento.fecha_completado).toISOString().slice(0, 16) : ''
    };
    this.mostrarModal = true;
    this.mensaje = '';
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.mantenimientoSeleccionado = null;
  }

  guardarMantenimiento(): void {
    if (this.mantenimientoSeleccionado) {
      this.actualizarMantenimiento();
    } else {
      this.crearMantenimiento();
    }
  }

  crearMantenimiento(): void {
    this.cargando = true;

    const mantenimientoData = {
      ...this.nuevoMantenimiento,
      contrato_id: this.nuevoMantenimiento.contrato_id || null
    };

    this.mantenimientosService.crearMantenimiento(mantenimientoData).subscribe({
      next: (mantenimiento) => {
        this.mantenimientos.push(mantenimiento);
        this.cerrarModal();
        this.mensaje = 'Mantenimiento registrado exitosamente';
        this.cargando = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.mensaje = 'Error al registrar mantenimiento: ' + error.message;
        this.cargando = false;
        this.cdRef.detectChanges();
      }
    });
  }

  actualizarMantenimiento(): void {
    if (!this.mantenimientoSeleccionado) return;

    this.cargando = true;

    const mantenimientoData = {
      ...this.mantenimientoSeleccionado,
      contrato_id: this.mantenimientoSeleccionado.contrato_id || null
    };

    this.mantenimientosService.actualizarMantenimiento(
      this.mantenimientoSeleccionado.id, 
      mantenimientoData
    ).subscribe({
      next: (mantenimiento) => {
        const index = this.mantenimientos.findIndex(m => m.id === mantenimiento.id);
        if (index !== -1) {
          this.mantenimientos[index] = mantenimiento;
        }
        this.cerrarModal();
        this.mensaje = 'Mantenimiento actualizado exitosamente';
        this.cargando = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.mensaje = 'Error al actualizar mantenimiento: ' + error.message;
        this.cargando = false;
        this.cdRef.detectChanges();
      }
    });
  }

  eliminarMantenimiento(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este mantenimiento?')) {
      this.cargando = true;
      this.mantenimientosService.eliminarMantenimiento(id).subscribe({
        next: () => {
          this.mantenimientos = this.mantenimientos.filter(m => m.id !== id);
          this.mensaje = 'Mantenimiento eliminado exitosamente';
          this.cargando = false;
          this.cdRef.detectChanges();
        },
        error: (error) => {
          this.mensaje = 'Error al eliminar mantenimiento: ' + error.message;
          this.cargando = false;
          this.cdRef.detectChanges();
        }
      });
    }
  }

  obtenerNombreVehiculo(vehiculoId: string): string {
    const vehiculo = this.vehiculos.find(v => v.id === vehiculoId);
    return vehiculo ? vehiculo.nombre : 'Desconocido';
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'Completado':
        return 'bg-success';
      case 'En Proceso':
        return 'bg-warning';
      case 'Pendiente':
        return 'bg-info';
      case 'Cancelado':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  obtenerClaseTipo(tipo: string): string {
    switch (tipo) {
      case 'Limpieza':
        return 'bg-primary';
      case 'Revisión General':
        return 'bg-info';
      case 'Cambio de Aceite':
        return 'bg-warning';
      case 'Reparación Mecánica':
        return 'bg-danger';
      case 'Reparación Eléctrica':
        return 'bg-dark';
      default:
        return 'bg-secondary';
    }
  }

  formatearFecha(fechaString: string): string {
    return new Date(fechaString).toLocaleString('es-CO');
  }

  obtenerEstadisticas(): any {
    const totalMantenimientos = this.mantenimientos.length;
    const mantenimientosPendientes = this.mantenimientos.filter(m => m.estado === 'Pendiente').length;
    const mantenimientosCompletados = this.mantenimientos.filter(m => m.estado === 'Completado').length;
    const costoTotal = this.mantenimientos.reduce((sum, m) => sum + m.costo, 0);
    const costoPendiente = this.mantenimientos
      .filter(m => m.estado !== 'Completado')
      .reduce((sum, m) => sum + m.costo, 0);

    return {
      totalMantenimientos,
      mantenimientosPendientes,
      mantenimientosCompletados,
      costoTotal,
      costoPendiente
    };
  }

  onEstadoCambio(estado: string): void {
    if (estado === 'Completado') {
      const fechaActual = new Date().toISOString().slice(0, 16);
      if (this.mantenimientoSeleccionado) {
        this.mantenimientoSeleccionado.fecha_completado = fechaActual;
      } else {
        this.nuevoMantenimiento.fecha_completado = fechaActual;
      }
    } else if (estado !== 'Completado') {
      if (this.mantenimientoSeleccionado) {
        this.mantenimientoSeleccionado.fecha_completado = '';
      } else {
        this.nuevoMantenimiento.fecha_completado = '';
      }
    }
  }
}