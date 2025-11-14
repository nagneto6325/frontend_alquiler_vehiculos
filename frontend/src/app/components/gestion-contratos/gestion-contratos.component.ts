import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ContratosService } from '../../services/contratos.service';
import { ClientesService } from '../../services/clientes.service';
import { VehiculosService } from '../../services/vehiculos.service';

@Component({
  selector: 'app-gestion-contratos',
  templateUrl: './gestion-contratos.component.html',
  styleUrls: ['./gestion-contratos.component.css']
})
export class GestionContratosComponent implements OnInit {
  contratos: any[] = [];
  clientes: any[] = [];
  vehiculos: any[] = [];
  contratoSeleccionado: any = null;
  nuevoContrato = {
    cliente_id: '',
    vehiculo_id: '',
    horas_contratadas: 1,
    precio_por_hora: 0,
    pagado: false,
    fecha_inicio: new Date().toISOString().slice(0, 16),
    fecha_fin_estimada: new Date(Date.now() + 3600000).toISOString().slice(0, 16)
  };
  cargando = false;
  mensaje = '';
  mostrarModal = false;

  constructor(
    private contratosService: ContratosService,
    private clientesService: ClientesService,
    private vehiculosService: VehiculosService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    
    Promise.all([
      this.contratosService.obtenerContratos().toPromise(),
      this.clientesService.obtenerClientes().toPromise(),
      this.vehiculosService.obtenerVehiculos().toPromise()
    ]).then(([contratos, clientes, vehiculos]) => {
      this.contratos = contratos || [];
      this.clientes = clientes || [];
      this.vehiculos = vehiculos || [];
      this.cargando = false;
      this.cdRef.detectChanges();
    }).catch(error => {
      this.mensaje = 'Error al cargar datos: ' + error.message;
      this.cargando = false;
      this.cdRef.detectChanges();
    });
  }

  abrirModalNuevo(): void {
    this.contratoSeleccionado = null;
    this.nuevoContrato = {
      cliente_id: '',
      vehiculo_id: '',
      horas_contratadas: 1,
      precio_por_hora: 0,
      pagado: false,
      fecha_inicio: new Date().toISOString().slice(0, 16),
      fecha_fin_estimada: new Date(Date.now() + 3600000).toISOString().slice(0, 16)
    };
    this.mostrarModal = true;
    this.mensaje = '';
  }

  abrirModalEditar(contrato: any): void {
    this.contratoSeleccionado = { 
      ...contrato,
      fecha_inicio: new Date(contrato.fecha_inicio).toISOString().slice(0, 16),
      fecha_fin_estimada: new Date(contrato.fecha_fin_estimada).toISOString().slice(0, 16),
      fecha_fin_real: contrato.fecha_fin_real ? new Date(contrato.fecha_fin_real).toISOString().slice(0, 16) : ''
    };
    this.mostrarModal = true;
    this.mensaje = '';
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.contratoSeleccionado = null;
  }

  guardarContrato(): void {
    if (this.contratoSeleccionado) {
      this.actualizarContrato();
    } else {
      this.crearContrato();
    }
  }

  crearContrato(): void {
    this.cargando = true;
    
    const contratoData = {
      ...this.nuevoContrato,
      precio_total: this.nuevoContrato.horas_contratadas * this.nuevoContrato.precio_por_hora
    };

    this.contratosService.crearContrato(contratoData).subscribe({
      next: (contrato) => {
        this.contratos.push(contrato);
        this.cerrarModal();
        this.mensaje = 'Contrato creado exitosamente';
        this.cargando = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.mensaje = 'Error al crear contrato: ' + error.message;
        this.cargando = false;
        this.cdRef.detectChanges();
      }
    });
  }

  actualizarContrato(): void {
    if (!this.contratoSeleccionado) return;

    this.cargando = true;
    
    const contratoData = {
      ...this.contratoSeleccionado,
      precio_total: this.contratoSeleccionado.horas_contratadas * this.contratoSeleccionado.precio_por_hora
    };

    this.contratosService.actualizarContrato(this.contratoSeleccionado.id, contratoData).subscribe({
      next: (contrato) => {
        const index = this.contratos.findIndex(c => c.id === contrato.id);
        if (index !== -1) {
          this.contratos[index] = contrato;
        }
        this.cerrarModal();
        this.mensaje = 'Contrato actualizado exitosamente';
        this.cargando = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.mensaje = 'Error al actualizar contrato: ' + error.message;
        this.cargando = false;
        this.cdRef.detectChanges();
      }
    });
  }

  eliminarContrato(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este contrato?')) {
      this.cargando = true;
      this.contratosService.eliminarContrato(id).subscribe({
        next: () => {
          this.contratos = this.contratos.filter(c => c.id !== id);
          this.mensaje = 'Contrato eliminado exitosamente';
          this.cargando = false;
          this.cdRef.detectChanges();
        },
        error: (error) => {
          this.mensaje = 'Error al eliminar contrato: ' + error.message;
          this.cargando = false;
          this.cdRef.detectChanges();
        }
      });
    }
  }

  obtenerNombreCliente(clienteId: string): string {
    const cliente = this.clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : 'Desconocido';
  }

  obtenerNombreVehiculo(vehiculoId: string): string {
    const vehiculo = this.vehiculos.find(v => v.id === vehiculoId);
    return vehiculo ? vehiculo.nombre : 'Desconocido';
  }

  obtenerClaseEstado(contrato: any): string {
    if (contrato.fecha_fin_real) {
      return 'bg-secondary';
    } else if (contrato.pagado) {
      return 'bg-success';
    } else {
      return 'bg-warning';
    }
  }

  obtenerTextoEstado(contrato: any): string {
    if (contrato.fecha_fin_real) {
      return 'Finalizado';
    } else if (contrato.pagado) {
      return 'Activo - Pagado';
    } else {
      return 'Activo - Pendiente pago';
    }
  }

  formatearFecha(fechaString: string): string {
    return new Date(fechaString).toLocaleString('es-CO');
  }

  calcularPrecioTotal(): number {
    const horas = this.contratoSeleccionado ? 
      this.contratoSeleccionado.horas_contratadas : 
      this.nuevoContrato.horas_contratadas;
    
    const tarifa = this.contratoSeleccionado ? 
      this.contratoSeleccionado.precio_por_hora : 
      this.nuevoContrato.precio_por_hora;
    
    return horas * tarifa;
  }

  onVehiculoSeleccionado(vehiculoId: string): void {
    const vehiculo = this.vehiculos.find(v => v.id === vehiculoId);
    if (vehiculo) {
      if (this.contratoSeleccionado) {
        this.contratoSeleccionado.precio_por_hora = vehiculo.tarifa_hora;
      } else {
        this.nuevoContrato.precio_por_hora = vehiculo.tarifa_hora;
      }
    }
  }

  obtenerContratosActivos(): number {
    return this.contratos?.filter(c => !c.fecha_fin_real)?.length || 0;
  }

  obtenerContratosPagados(): number {
    return this.contratos?.filter(c => c.pagado)?.length || 0;
  }

  obtenerIngresosTotales(): number {
    return this.contratos?.reduce((sum, c) => sum + (c.precio_total || 0), 0) || 0;
  }
}