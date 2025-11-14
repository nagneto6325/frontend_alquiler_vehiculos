/**
 * Interfaz que representa un usuario del sistema
 */
export interface Usuario {
  /**
   * Identificador único del usuario
   */
  id: string;

  /**
   * Nombre de usuario para login
   */
  username: string;

  /**
   * Contraseña del usuario (solo para creación)
   */
  password?: string;

  /**
   * Fecha de creación del usuario
   */
  fecha_creacion: string;

  /**
   * Fecha de última actualización
   */
  fecha_actualizacion: string;

  /**
   * ID del usuario que creó este registro
   */
  id_usuario_creacion?: string;

  /**
   * ID del usuario que editó por última vez
   */
  id_usuario_edicion?: string;
}

/**
 * Interfaz para respuesta de login
 */
export interface LoginResponse {
  /**
   * Token de acceso JWT
   */
  access_token: string;

  /**
   * Tipo de token
   */
  token_type: string;

  /**
   * Datos del usuario autenticado
   */
  usuario: Usuario;
}