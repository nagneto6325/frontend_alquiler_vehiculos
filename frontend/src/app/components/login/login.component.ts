import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Componente de autenticación que maneja el inicio de sesión
 * y registro de usuarios en el sistema
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /**
   * Emisor de eventos para notificar login exitoso
   */
  @Output() loginExitoso = new EventEmitter<any>();

  /**
   * Bandera para alternar entre login y registro
   */
  esRegistro = false;

  /**
   * Datos del formulario de login
   */
  datosLogin = {
    username: '',
    password: ''
  };

  /**
   * Datos del formulario de registro
   */
  datosRegistro = {
    username: '',
    password: ''
  };

  /**
   * Estado de carga para deshabilitar formularios
   */
  cargando = false;

  /**
   * Mensaje de error para mostrar al usuario
   */
  mensajeError = '';

  /**
   * Constructor que inyecta el cliente HTTP
   * @param http Cliente HTTP para realizar peticiones a la API
   */
  constructor(private http: HttpClient) {}

  /**
   * Maneja el envío del formulario de login
   */
  async onSubmitLogin(): Promise<void> {
    if (!this.datosLogin.username || !this.datosLogin.password) {
      this.mensajeError = 'Por favor complete todos los campos';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    try {
      const formData = new FormData();
      formData.append('username', this.datosLogin.username);
      formData.append('password', this.datosLogin.password);

      const respuesta = await this.http.post<any>('http://localhost:8000/api/auth/login', formData).toPromise();
      
      if (respuesta && respuesta.access_token) {
        localStorage.setItem('authToken', respuesta.access_token);
        localStorage.setItem('userData', JSON.stringify(respuesta.usuario));
        this.loginExitoso.emit(respuesta);
      }
    } catch (error: any) {
      this.mensajeError = error.error?.detail || 'Error de conexión con el servidor';
    } finally {
      this.cargando = false;
    }
  }

  /**
   * Maneja el envío del formulario de registro
   */
  async onSubmitRegistro(): Promise<void> {
    if (!this.datosRegistro.username || !this.datosRegistro.password) {
      this.mensajeError = 'Por favor complete todos los campos';
      return;
    }

    if (this.datosRegistro.password.length < 3) {
      this.mensajeError = 'La contraseña debe tener al menos 3 caracteres';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    try {
      const datosRegistro = {
        username: this.datosRegistro.username,
        password: this.datosRegistro.password
      };

      const respuesta = await this.http.post<any>('http://localhost:8000/api/auth/registrar', datosRegistro).toPromise();
      
      this.mensajeError = 'Usuario registrado exitosamente. Ahora puede iniciar sesión.';
      this.esRegistro = false;
      this.datosRegistro = { username: '', password: '' };
      
    } catch (error: any) {
      this.mensajeError = error.error?.detail || 'Error al registrar usuario';
    } finally {
      this.cargando = false;
    }
  }

  /**
   * Alterna entre los modos de login y registro
   */
  toggleModo(): void {
    this.esRegistro = !this.esRegistro;
    this.mensajeError = '';
    this.datosLogin = { username: '', password: '' };
    this.datosRegistro = { username: '', password: '' };
  }
}