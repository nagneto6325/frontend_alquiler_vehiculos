import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

/**
 * Servicio para gestión de mantenimientos
 * Proporciona métodos para CRUD de mantenimientos en el sistema
 */
@Injectable({
  providedIn: 'root'
})
export class MantenimientosService {
  /**
   * Constructor que inyecta el servicio API base
   * @param apiService Servicio para comunicación con la API
   */
  constructor(private apiService: ApiService) {}

  /**
   * Obtiene la lista completa de mantenimientos
   * @returns Observable con array de mantenimientos
   */
  obtenerMantenimientos(): Observable<any[]> {
    return this.apiService.get<any[]>('/mantenimientos');
  }

  /**
   * Obtiene un mantenimiento específico por su ID
   * @param id Identificador único del mantenimiento
   * @returns Observable con los datos del mantenimiento
   */
  obtenerMantenimientoPorId(id: string): Observable<any> {
    return this.apiService.get<any>(`/mantenimientos/${id}`);
  }

  /**
   * Crea un nuevo mantenimiento en el sistema
   * @param mantenimiento Datos del mantenimiento a crear
   * @returns Observable con el mantenimiento creado
   */
  crearMantenimiento(mantenimiento: any): Observable<any> {
    return this.apiService.post<any>('/mantenimientos', mantenimiento);
  }

  /**
   * Actualiza un mantenimiento existente
   * @param id Identificador único del mantenimiento
   * @param mantenimiento Datos actualizados del mantenimiento
   * @returns Observable con el mantenimiento actualizado
   */
  actualizarMantenimiento(id: string, mantenimiento: any): Observable<any> {
    return this.apiService.put<any>(`/mantenimientos/${id}`, mantenimiento);
  }

  /**
   * Elimina un mantenimiento del sistema
   * @param id Identificador único del mantenimiento a eliminar
   * @returns Observable con la respuesta de eliminación
   */
  eliminarMantenimiento(id: string): Observable<any> {
    return this.apiService.delete<any>(`/mantenimientos/${id}`);
  }

  /**
   * Obtiene mantenimientos pendientes
   * @returns Observable con array de mantenimientos pendientes
   */
  obtenerMantenimientosPendientes(): Observable<any[]> {
    return this.apiService.get<any[]>('/mantenimientos');
  }
}