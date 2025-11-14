import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PagosService } from '../../services/pagos.service';
import { ContratosService } from '../../services/contratos.service';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-gestion-pagos',
  templateUrl: './gestion-pagos.component.html',
  styleUrls: ['./gestion-pagos.component.css']
})
export class GestionPagosComponent implements OnInit {
  pagos: any[] = [];
  contratos: any[] = [];
  clientes: any[] = [];
  pagoSeleccionado: any = null;
  nuevoPago = {
    contrato_id: '',
    cliente_id: '',
    monto: 0,
    metodo_pago: 'Efectivo',
    fecha_pago: new Date().toISOString().slice(0, 16),
    estado: 'Completado'
  };
  cargando = false;
  mensaje = '';
  mostrarModal = false;
  metodosPago = ['Efectivo', 'Tarjeta Débito', 'Tarjeta Crédito', 'Transferencia', 'PSE'];
  estadosPago = ['Completado', 'Pendiente', 'Fallido', 'Reembolsado'];

  constructor(
    private pagosService: PagosService,
    private contratosService: ContratosService,
    private clientesService: ClientesService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    
    Promise.all([
      this.pagosService.obtenerPagos().toPromise(),
      this.contratosService.obtenerContratos().toPromise(),
      this.clientesService.obtenerClientes().toPromise()
    ]).then(([pagos, contratos, clientes]) => {
      this.pagos = pagos || [];
      this.contratos = contratos || [];
      this.clientes = clientes || [];
      this.cargando = false;
      this.cdRef.detectChanges();
    }).catch(error => {
      this.mensaje = 'Error al cargar datos: ' + error.message;
      this.cargando = false;
      this.cdRef.detectChanges();
    });
  }

  abrirModalNuevo(): void {
    this.pagoSeleccionado = null;
    this.nuevoPago = {
      contrato_id: '',
      cliente_id: '',
      monto: 0,
      metodo_pago: 'Efectivo',
      fecha_pago: new Date().toISOString().slice(0, 16),
      estado: 'Completado'
    };
    this.mostrarModal = true;
    this.mensaje = '';
  }

  abrirModalEditar(pago: any): void {
    this.pagoSeleccionado = { 
      ...pago,
      fecha_pago: new Date(pago.fecha_pago).toISOString().slice(0, 16)
    };
    this.mostrarModal = true;
    this.mensaje = '';
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.pagoSeleccionado = null;
  }

  guardarPago(): void {
    if (this.pagoSeleccionado) {
      this.actualizarPago();
    } else {
      this.crearPago();
    }
  }

  crearPago(): void {
    this.cargando = true;

    this.pagosService.crearPago(this.nuevoPago).subscribe({
      next: (pago) => {
        this.pagos.push(pago);
        this.cerrarModal();
        this.mensaje = 'Pago registrado exitosamente';
        this.cargando = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.mensaje = 'Error al registrar pago: ' + error.message;
        this.cargando = false;
        this.cdRef.detectChanges();
      }
    });
  }

  actualizarPago(): void {
    if (!this.pagoSeleccionado) return;

    this.cargando = true;

    this.pagosService.actualizarPago(this.pagoSeleccionado.id, this.pagoSeleccionado).subscribe({
      next: (pago) => {
        const index = this.pagos.findIndex(p => p.id === pago.id);
        if (index !== -1) {
          this.pagos[index] = pago;
        }
        this.cerrarModal();
        this.mensaje = 'Pago actualizado exitosamente';
        this.cargando = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.mensaje = 'Error al actualizar pago: ' + error.message;
        this.cargando = false;
        this.cdRef.detectChanges();
      }
    });
  }

  eliminarPago(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este pago?')) {
      this.cargando = true;
      this.pagosService.eliminarPago(id).subscribe({
        next: () => {
          this.pagos = this.pagos.filter(p => p.id !== id);
          this.mensaje = 'Pago eliminado exitosamente';
          this.cargando = false;
          this.cdRef.detectChanges();
        },
        error: (error) => {
          this.mensaje = 'Error al eliminar pago: ' + error.message;
          this.cargando = false;
          this.cdRef.detectChanges();
        }
      });
    }
  }

  obtenerNombreCliente(contratoId: string): string {
    const contrato = this.contratos.find(c => c.id === contratoId);
    if (!contrato) return 'Desconocido';
    
    const cliente = this.clientes.find(cl => cl.id === contrato.cliente_id);
    return cliente ? cliente.nombre : 'Desconocido';
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'Completado':
        return 'bg-success';
      case 'Pendiente':
        return 'bg-warning';
      case 'Fallido':
        return 'bg-danger';
      case 'Reembolsado':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  obtenerClaseMetodo(metodo: string): string {
    switch (metodo) {
      case 'Efectivo':
        return 'bg-primary';
      case 'Tarjeta Débito':
        return 'bg-info';
      case 'Tarjeta Crédito':
        return 'bg-warning';
      case 'Transferencia':
        return 'bg-success';
      case 'PSE':
        return 'bg-dark';
      default:
        return 'bg-secondary';
    }
  }

  formatearFecha(fechaString: string): string {
    return new Date(fechaString).toLocaleString('es-CO');
  }

  obtenerEstadisticas(): any {
    const totalPagos = this.pagos.length;
    const totalMonto = this.pagos.reduce((sum, pago) => sum + pago.monto, 0);
    const pagosCompletados = this.pagos.filter(p => p.estado === 'Completado').length;
    const montoCompletado = this.pagos
      .filter(p => p.estado === 'Completado')
      .reduce((sum, pago) => sum + pago.monto, 0);

    return {
      totalPagos,
      totalMonto,
      pagosCompletados,
      montoCompletado
    };
  }

  onContratoSeleccionado(contratoId: string): void {
    const contrato = this.contratos.find(c => c.id === contratoId);
    if (contrato) {
      if (this.pagoSeleccionado) {
        this.pagoSeleccionado.cliente_id = contrato.cliente_id;
        this.pagoSeleccionado.monto = contrato.precio_total;
      } else {
        this.nuevoPago.cliente_id = contrato.cliente_id;
        this.nuevoPago.monto = contrato.precio_total;
      }
    }
  }
}