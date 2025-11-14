/**
 * Interfaz que representa un vehículo en el sistema
 */
export interface Vehiculo {
  /**
   * Identificador único del vehículo
   */
  id: string;

  /**
   * Nombre descriptivo del vehículo
   */
  nombre: string;

  /**
   * Tipo de vehículo (Auto, Moto, Camioneta, etc.)
   */
  tipo: string;

  /**
   * Tarifa por hora de alquiler en COP
   */
  tarifa_hora: number;

  /**
   * Indica si el vehículo está disponible para alquiler
   */
  disponible: boolean;

  /**
   * Indica si el vehículo necesita mantenimiento
   */
  necesita_mantenimiento: boolean;

  /**
   * Número de puertas (solo para autos)
   */
  puertas?: number;

  /**
   * Cilindraje en cc (solo para motos)
   */
  cilindraje?: number;

  /**
   * Capacidad de carga en kg (solo para camionetas)
   */
  capacidad_carga?: number;

  /**
   * Tipo de bicicleta (solo para bicicletas)
   */
  tipo_bici?: string;

  /**
   * Autonomía en km (solo para patinetas eléctricas)
   */
  autonomia_km?: number;

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
 * Interfaz para creación de vehículos
 */
export interface VehiculoCreate {
  nombre: string;
  tipo: string;
  tarifa_hora: number;
  disponible: boolean;
  necesita_mantenimiento: boolean;
  puertas?: number;
  cilindraje?: number;
  capacidad_carga?: number;
  tipo_bici?: string;
  autonomia_km?: number;
}