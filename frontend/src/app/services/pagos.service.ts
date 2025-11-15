import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

/**
 * Servicio para gestión de pagos
 * Proporciona métodos para CRUD de pagos en el sistema
 */
@Injectable({
  providedIn: 'root'
})
export class PagosService {
  /**
   * Constructor que inyecta el servicio API base
   * @param apiService Servicio para comunicación con la API
   */
  constructor(private apiService: ApiService) {}

  /**
   * Obtiene la lista completa de pagos
   * @returns Observable con array de pagos
   */
  obtenerPagos(): Observable<any[]> {
    return this.apiService.get<any[]>('/pagos');
  }

  /**
   * Obtiene un pago específico por su ID
   * @param id Identificador único del pago
   * @returns Observable con los datos del pago
   */
  obtenerPagoPorId(id: string): Observable<any> {
    return this.apiService.get<any>(`/pagos/${id}`);
  }

  /**
   * Crea un nuevo pago en el sistema
   * @param pago Datos del pago a crear
   * @returns Observable con el pago creado
   */
  crearPago(pago: any): Observable<any> {
    return this.apiService.post<any>('/pagos', pago);
  }

  /**
   * Actualiza un pago existente
   * @param id Identificador único del pago
   * @param pago Datos actualizados del pago
   * @returns Observable con el pago actualizado
   */
  actualizarPago(id: string, pago: any): Observable<any> {
    return this.apiService.put<any>(`/pagos/${id}`, pago);
  }

  /**
   * Elimina un pago del sistema
   * @param id Identificador único del pago a eliminar
   * @returns Observable con la respuesta de eliminación
   */
  eliminarPago(id: string): Observable<any> {
    return this.apiService.delete<any>(`/pagos/${id}`);
  }
}