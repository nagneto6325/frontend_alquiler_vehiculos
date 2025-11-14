import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-gestion-clientes',
  templateUrl: './gestion-clientes.component.html',
  styleUrls: ['./gestion-clientes.component.css']
})
export class GestionClientesComponent implements OnInit {
  clientes: any[] = [];
  clienteSeleccionado: any = null;
  nuevoCliente = {
    nombre: '',
    contacto: '',
    usuario_id: ''
  };
  cargando = false;
  mensaje = '';
  mostrarModal = false;

  constructor(
    private clientesService: ClientesService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando = true;
    this.clientesService.obtenerClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.cargando = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.mensaje = 'Error al cargar clientes: ' + error.message;
        this.cargando = false;
        this.cdRef.detectChanges();
      }
    });
  }

  abrirModalNuevo(): void {
    this.clienteSeleccionado = null;
    this.nuevoCliente = {
      nombre: '',
      contacto: '',
      usuario_id: ''
    };
    this.mostrarModal = true;
    this.mensaje = '';
  }

  abrirModalEditar(cliente: any): void {
    this.clienteSeleccionado = { ...cliente };
    this.mostrarModal = true;
    this.mensaje = '';
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.clienteSeleccionado = null;
  }

  guardarCliente(): void {
    if (this.clienteSeleccionado) {
      this.actualizarCliente();
    } else {
      this.crearCliente();
    }
  }

  crearCliente(): void {
    this.cargando = true;
    this.clientesService.crearCliente(this.nuevoCliente).subscribe({
      next: (cliente) => {
        this.clientes.push(cliente);
        this.cerrarModal();
        this.mensaje = 'Cliente creado exitosamente';
        this.cargando = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.mensaje = 'Error al crear cliente: ' + error.message;
        this.cargando = false;
        this.cdRef.detectChanges();
      }
    });
  }

  actualizarCliente(): void {
    if (!this.clienteSeleccionado) return;

    this.cargando = true;
    this.clientesService.actualizarCliente(this.clienteSeleccionado.id, this.clienteSeleccionado).subscribe({
      next: (cliente) => {
        const index = this.clientes.findIndex(c => c.id === cliente.id);
        if (index !== -1) {
          this.clientes[index] = cliente;
        }
        this.cerrarModal();
        this.mensaje = 'Cliente actualizado exitosamente';
        this.cargando = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.mensaje = 'Error al actualizar cliente: ' + error.message;
        this.cargando = false;
        this.cdRef.detectChanges();
      }
    });
  }

  eliminarCliente(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
      this.cargando = true;
      this.clientesService.eliminarCliente(id).subscribe({
        next: () => {
          this.clientes = this.clientes.filter(c => c.id !== id);
          this.mensaje = 'Cliente eliminado exitosamente';
          this.cargando = false;
          this.cdRef.detectChanges();
        },
        error: (error) => {
          this.mensaje = 'Error al eliminar cliente: ' + error.message;
          this.cargando = false;
          this.cdRef.detectChanges();
        }
      });
    }
  }

  formatearFecha(fechaString: string): string {
    return new Date(fechaString).toLocaleDateString('es-CO');
  }
}