import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  constructor(private apiService: ApiService) {}

  // Obtener todos los vehículos
  obtenerVehiculos(): Observable<any[]> {
    return this.apiService.get<any[]>('/vehiculos');
  }

  // Obtener un vehículo por ID
  obtenerVehiculoPorId(id: string): Observable<any> {
    return this.apiService.get<any>(`/vehiculos/${id}`);
  }

  // Crear vehículo
  crearVehiculo(data: any): Observable<any> {
    return this.apiService.post<any>('/vehiculos', data);
  }

  // Actualizar vehículo
  actualizarVehiculo(id: string, data: any): Observable<any> {
    return this.apiService.put<any>(`/vehiculos/${id}`, data);
  }

  // Eliminar vehículo
  eliminarVehiculo(id: string): Observable<any> {
    return this.apiService.delete<any>(`/vehiculos/${id}`);
  }

  // Vehículos disponibles (usado en contratos)
  obtenerVehiculosDisponibles(): Observable<any[]> {
    return this.apiService.get<any[]>('/vehiculos');
  }
}
