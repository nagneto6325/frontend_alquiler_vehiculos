/**
 * Interfaz que representa un mantenimiento en el sistema
 */
export interface Mantenimiento {
  /**
   * Identificador único del mantenimiento
   */
  id: string;

  /**
   * ID del vehículo asociado al mantenimiento
   */
  vehiculo_id: string;

  /**
   * ID del contrato asociado (opcional)
   */
  contrato_id?: string;

  /**
   * Tipo de mantenimiento
   */
  tipo: string;

  /**
   * Descripción detallada del mantenimiento
   */
  descripcion?: string;

  /**
   * Costo del mantenimiento
   */
  costo: number;

  /**
   * Fecha de solicitud del mantenimiento
   */
  fecha_solicitud: string;

  /**
   * Fecha de completado del mantenimiento
   */
  fecha_completado?: string;

  /**
   * Estado del mantenimiento
   */
  estado: string;

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
 * Interfaz para creación de mantenimientos
 */
export interface MantenimientoCreate {
  vehiculo_id: string;
  contrato_id?: string;
  tipo: string;
  descripcion?: string;
  costo: number;
  fecha_solicitud: string;
  fecha_completado?: string;
  estado: string;
}