import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

/**
 * Servicio para gestión de contratos
 * Proporciona métodos para CRUD de contratos en el sistema
 */
@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  /**
   * Constructor que inyecta el servicio API base
   * @param apiService Servicio para comunicación con la API
   */
  constructor(private apiService: ApiService) {}

  /**
   * Obtiene la lista completa de contratos
   * @returns Observable con array de contratos
   */
  obtenerContratos(): Observable<any[]> {
    return this.apiService.get<any[]>('/contratos');
  }

  /**
   * Obtiene un contrato específico por su ID
   * @param id Identificador único del contrato
   * @returns Observable con los datos del contrato
   */
  obtenerContratoPorId(id: string): Observable<any> {
    return this.apiService.get<any>(`/contratos/${id}`);
  }

  /**
   * Crea un nuevo contrato en el sistema
   * @param contrato Datos del contrato a crear
   * @returns Observable con el contrato creado
   */
  crearContrato(contrato: any): Observable<any> {
    return this.apiService.post<any>('/contratos', contrato);
  }

  /**
   * Actualiza un contrato existente
   * @param id Identificador único del contrato
   * @param contrato Datos actualizados del contrato
   * @returns Observable con el contrato actualizado
   */
  actualizarContrato(id: string, contrato: any): Observable<any> {
    return this.apiService.put<any>(`/contratos/${id}`, contrato);
  }

  /**
   * Elimina un contrato del sistema
   * @param id Identificador único del contrato a eliminar
   * @returns Observable con la respuesta de eliminación
   */
  eliminarContrato(id: string): Observable<any> {
    return this.apiService.delete<any>(`/contratos/${id}`);
  }

  /**
   * Obtiene contratos activos (sin fecha de fin real)
   * @returns Observable con array de contratos activos
   */
  obtenerContratosActivos(): Observable<any[]> {
    return this.apiService.get<any[]>('/contratos');
  }
}