import { Component, OnInit } from '@angular/core';
import { VehiculosService } from '../../services/vehiculos.service';

@Component({
  selector: 'app-gestion-vehiculos',
  templateUrl: './gestion-vehiculos.component.html',
  styleUrls: ['./gestion-vehiculos.component.css']
})
export class GestionVehiculosComponent implements OnInit {
  vehiculos: any[] = [];
  vehiculoSeleccionado: any = null;
  nuevoVehiculo: any = {
    nombre: '',
    tipo: '',
    tarifa_hora: 0,
    disponible: true,
    necesita_mantenimiento: false,
    puertas: null,
    cilindraje: null,
    capacidad_carga: null,
    tipo_bici: '',
    autonomia_km: null
  };
  mostrarModal = false;
  cargando = false;
  mensaje = '';

  constructor(private vehiculosService: VehiculosService) {}

  ngOnInit(): void {
    this.getVehiculos();
  }

  getVehiculos(): void {
    this.cargando = true;
    this.vehiculosService.obtenerVehiculos().subscribe({
      next: (data: any[]) => {
        this.vehiculos = data || [];
        this.cargando = false;
      },
      error: (err) => {
        this.mensaje = 'Error al obtener vehículos';
        this.cargando = false;
      }
    });
  }

  abrirModalNuevo(): void {
    this.vehiculoSeleccionado = null;
    this.resetNuevoVehiculo();
    this.mostrarModal = true;
  }

  abrirModalEditar(vehiculo: any): void {
    this.vehiculoSeleccionado = vehiculo;
    this.nuevoVehiculo = {
      nombre: vehiculo.nombre ?? '',
      tipo: vehiculo.tipo ?? '',
      tarifa_hora: vehiculo.tarifa_hora ?? 0,
      disponible: vehiculo.disponible ?? true,
      necesita_mantenimiento: vehiculo.necesita_mantenimiento ?? false,
      puertas: vehiculo.puertas ?? null,
      cilindraje: vehiculo.cilindraje ?? null,
      capacidad_carga: vehiculo.capacidad_carga ?? null,
      tipo_bici: vehiculo.tipo_bici ?? '',
      autonomia_km: vehiculo.autonomia_km ?? null
    };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.resetNuevoVehiculo();
    this.vehiculoSeleccionado = null;
    this.mensaje = '';
  }

  guardarVehiculo(): void {
    this.cargando = true;
    if (this.vehiculoSeleccionado && this.vehiculoSeleccionado.id) {
      this.vehiculosService.actualizarVehiculo(this.vehiculoSeleccionado.id, this.nuevoVehiculo).subscribe({
        next: () => {
          this.mensaje = 'Vehículo actualizado correctamente';
          this.getVehiculos();
          this.cerrarModal();
        },
        error: () => {
          this.mensaje = 'Error al actualizar vehículo';
          this.cargando = false;
        }
      });
    } else {
      this.vehiculosService.crearVehiculo(this.nuevoVehiculo).subscribe({
        next: () => {
          this.mensaje = 'Vehículo creado correctamente';
          this.getVehiculos();
          this.cerrarModal();
        },
        error: () => {
          this.mensaje = 'Error al crear vehículo';
          this.cargando = false;
        }
      });
    }
  }

  eliminarVehiculo(id: string): void {
    if (!confirm('¿Eliminar vehículo?')) return;
    this.vehiculosService.eliminarVehiculo(id).subscribe({
      next: () => {
        this.mensaje = 'Vehículo eliminado';
        this.getVehiculos();
      },
      error: () => {
        this.mensaje = 'Error al eliminar vehículo';
      }
    });
  }

  resetNuevoVehiculo(): void {
    this.nuevoVehiculo = {
      nombre: '',
      tipo: '',
      tarifa_hora: 0,
      disponible: true,
      necesita_mantenimiento: false,
      puertas: null,
      cilindraje: null,
      capacidad_carga: null,
      tipo_bici: '',
      autonomia_km: null
    };
  }

  obtenerClaseDisponibilidad(disponible: boolean): string {
    return disponible ? 'bg-success' : 'bg-danger';
  }

  obtenerClaseMantenimiento(necesitaMantenimiento: boolean): string {
    return necesitaMantenimiento ? 'bg-warning' : 'bg-info';
  }
}
