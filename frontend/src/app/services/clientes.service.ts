import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

/**
 * Servicio para gestión de clientes
 * Proporciona métodos para CRUD de clientes en el sistema
 */
@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  /**
   * Constructor que inyecta el servicio API base
   * @param apiService Servicio para comunicación con la API
   */
  constructor(private apiService: ApiService) {}

  /**
   * Obtiene la lista completa de clientes
   * @returns Observable con array de clientes
   */
  obtenerClientes(): Observable<any[]> {
    return this.apiService.get<any[]>('/clientes');
  }

  /**
   * Obtiene un cliente específico por su ID
   * @param id Identificador único del cliente
   * @returns Observable con los datos del cliente
   */
  obtenerClientePorId(id: string): Observable<any> {
    return this.apiService.get<any>(`/clientes/${id}`);
  }

  /**
   * Crea un nuevo cliente en el sistema
   * @param cliente Datos del cliente a crear
   * @returns Observable con el cliente creado
   */
  crearCliente(cliente: any): Observable<any> {
    return this.apiService.post<any>('/clientes', cliente);
  }

  /**
   * Actualiza un cliente existente
   * @param id Identificador único del cliente
   * @param cliente Datos actualizados del cliente
   * @returns Observable con el cliente actualizado
   */
  actualizarCliente(id: string, cliente: any): Observable<any> {
    return this.apiService.put<any>(`/clientes/${id}`, cliente);
  }

  /**
   * Elimina un cliente del sistema
   * @param id Identificador único del cliente a eliminar
   * @returns Observable con la respuesta de eliminación
   */
  eliminarCliente(id: string): Observable<any> {
    return this.apiService.delete<any>(`/clientes/${id}`);
  }
}