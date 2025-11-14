/**
 * Interfaz que representa un contrato en el sistema
 */
export interface Contrato {
  /**
   * Identificador único del contrato
   */
  id: string;

  /**
   * ID del cliente asociado al contrato
   */
  cliente_id: string;

  /**
   * ID del vehículo asociado al contrato
   */
  vehiculo_id: string;

  /**
   * Número de horas contratadas
   */
  horas_contratadas: number;

  /**
   * Precio por hora del alquiler
   */
  precio_por_hora: number;

  /**
   * Precio total del contrato
   */
  precio_total: number;

  /**
   * Indica si el contrato ha sido pagado
   */
  pagado: boolean;

  /**
   * Fecha de inicio del contrato
   */
  fecha_inicio: string;

  /**
   * Fecha estimada de finalización
   */
  fecha_fin_estimada: string;

  /**
   * Fecha real de finalización (null si está activo)
   */
  fecha_fin_real?: string;

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
 * Interfaz para creación de contratos
 */
export interface ContratoCreate {
  cliente_id: string;
  vehiculo_id: string;
  horas_contratadas: number;
  precio_por_hora: number;
  pagado: boolean;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  fecha_fin_real?: string;
}