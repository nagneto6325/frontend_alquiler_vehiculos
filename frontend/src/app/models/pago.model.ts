/**
 * Interfaz que representa un pago en el sistema
 */
export interface Pago {
  /**
   * Identificador único del pago
   */
  id: string;

  /**
   * ID del contrato asociado al pago
   */
  contrato_id: string;

  /**
   * ID del cliente que realiza el pago
   */
  cliente_id: string;

  /**
   * Monto del pago
   */
  monto: number;

  /**
   * Método de pago utilizado
   */
  metodo_pago: string;

  /**
   * Fecha en que se realizó el pago
   */
  fecha_pago: string;

  /**
   * Estado del pago
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
 * Interfaz para creación de pagos
 */
export interface PagoCreate {
  contrato_id: string;
  cliente_id: string;
  monto: number;
  metodo_pago: string;
  fecha_pago: string;
  estado: string;
}