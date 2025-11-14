import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Servicio genérico para comunicación con la API del backend.
 * Todos los demás servicios usan este para realizar peticiones HTTP.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  /** URL base del backend FastAPI */
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  /**
   * Realiza una petición GET.
   * @param endpoint Ruta relativa (por ejemplo: '/clientes')
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  /**
   * Realiza una petición POST.
   * @param endpoint Ruta relativa (por ejemplo: '/clientes')
   * @param data Datos a enviar
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  /**
   * Realiza una petición PUT.
   * @param endpoint Ruta relativa (por ejemplo: '/clientes/1')
   * @param data Datos a actualizar
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data);
  }

  /**
   * Realiza una petición DELETE.
   * @param endpoint Ruta relativa (por ejemplo: '/clientes/1')
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
