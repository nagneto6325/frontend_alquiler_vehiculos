import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

/**
 * Servicio para manejar la autenticación de usuarios
 * Gestiona login, registro y verificación de tokens
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Constructor que inyecta el servicio API base
   * @param apiService Servicio para comunicación con la API
   */
  constructor(private apiService: ApiService) {}

  /**
   * Realiza el login de un usuario
   * @param username Nombre de usuario
   * @param password Contraseña
   * @returns Observable con la respuesta del login
   */
  login(username: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    return this.apiService.post('/auth/login', formData);
  }

  /**
   * Registra un nuevo usuario en el sistema
   * @param username Nombre de usuario
   * @param password Contraseña
   * @returns Observable con la respuesta del registro
   */
  registrar(username: string, password: string): Observable<any> {
    const datosRegistro = { username, password };
    return this.apiService.post('/auth/registrar', datosRegistro);
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns Verdadero si existe un token válido
   */
  estaAutenticado(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Obtiene el token de autenticación almacenado
   * @returns Token JWT o null si no existe
   */
  obtenerToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Obtiene los datos del usuario almacenados
   * @returns Datos del usuario o null si no existen
   */
  obtenerUsuario(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Cierra la sesión del usuario actual
   */
  cerrarSesion(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }
}