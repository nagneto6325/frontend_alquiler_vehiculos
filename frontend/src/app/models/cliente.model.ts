/**
 * Interfaz que representa un cliente en el sistema
 */
export interface Cliente {
  /**
   * Identificador único del cliente
   */
  id: string;

  /**
   * Nombre completo del cliente
   */
  nombre: string;

  /**
   * Información de contacto del cliente
   */
  contacto?: string;

  /**
   * ID del usuario asociado al cliente
   */
  usuario_id?: string;

  /**
   * Fecha de creación del registro
   */
  fecha_creacion: string;

  /**
   * Fecha de última actualización
   */
  fecha_actualizacion: string;

  /**
   * ID del usuario que creó el registro
   */
  id_usuario_creacion?: string;

  /**
   * ID del usuario que editó por última vez
   */
  id_usuario_edicion?: string;
}

/**
 * Interfaz para creación de clientes
 */
export interface ClienteCreate {
  nombre: string;
  contacto?: string;
  usuario_id?: string;
}