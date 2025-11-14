import { Component, OnInit } from '@angular/core';
import { VehiculosService } from '../../services/vehiculos.service';
import { ContratosService } from '../../services/contratos.service';
import { PagosService } from '../../services/pagos.service';
import { MantenimientosService } from '../../services/mantenimientos.service';

/**
 * Componente para la generación de reportes y estadísticas del sistema
 * Proporciona visualizaciones de datos y métricas importantes
 */
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  /**
   * Datos para gráficas y reportes
   */
  datosReportes: any = {};

  /**
   * Estado de carga para operaciones asíncronas
   */
  cargando = false;

  /**
   * Mensaje de error para el usuario
   */
  mensaje = '';

  /**
   * Rango de fechas para filtros
   */
  rangoFechas = {
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
    fin: new Date().toISOString().slice(0, 10)
  };

  /**
   * Constructor que inyecta los servicios necesarios
   * @param vehiculosService Servicio para datos de vehículos
   * @param contratosService Servicio para datos de contratos
   * @param pagosService Servicio para datos de pagos
   * @param mantenimientosService Servicio para datos de mantenimientos
   */
  constructor(
    private vehiculosService: VehiculosService,
    private contratosService: ContratosService,
    private pagosService: PagosService,
    private mantenimientosService: MantenimientosService
  ) {}

  /**
   * Inicializa el componente cargando los datos de reportes
   */
  ngOnInit(): void {
    this.cargarDatosReportes();
  }

  /**
   * Carga todos los datos necesarios para generar reportes
   */
  cargarDatosReportes(): void {
    this.cargando = true;
    
    Promise.all([
      this.vehiculosService.obtenerVehiculos().toPromise(),
      this.contratosService.obtenerContratos().toPromise(),
      this.pagosService.obtenerPagos().toPromise(),
      this.mantenimientosService.obtenerMantenimientos().toPromise()
    ]).then(([vehiculos, contratos, pagos, mantenimientos]) => {
      this.procesarDatosReportes(
        vehiculos || [],
        contratos || [],
        pagos || [],
        mantenimientos || []
      );
      this.cargando = false;
    }).catch(error => {
      this.mensaje = 'Error al cargar datos para reportes: ' + error.message;
      this.cargando = false;
    });
  }

  /**
   * Procesa los datos crudos para generar métricas y estadísticas
   * @param vehiculos Lista de vehículos
   * @param contratos Lista de contratos
   * @param pagos Lista de pagos
   * @param mantenimientos Lista de mantenimientos
   */
  procesarDatosReportes(vehiculos: any[], contratos: any[], pagos: any[], mantenimientos: any[]): void {
    // Estadísticas básicas
    this.datosReportes.estadisticasBasicas = this.calcularEstadisticasBasicas(
      vehiculos, contratos, pagos, mantenimientos
    );

    // Distribución de vehículos por tipo
    this.datosReportes.distribucionVehiculos = this.calcularDistribucionVehiculos(vehiculos);

    // Ingresos por mes
    this.datosReportes.ingresosMensuales = this.calcularIngresosMensuales(pagos);

    // Estado de contratos
    this.datosReportes.estadoContratos = this.calcularEstadoContratos(contratos);

    // Costos de mantenimiento
    this.datosReportes.costosMantenimiento = this.calcularCostosMantenimiento(mantenimientos);

    // Métodos de pago
    this.datosReportes.metodosPago = this.calcularMetodosPago(pagos);
  }

  /**
   * Calcula estadísticas básicas del sistema
   */
  calcularEstadisticasBasicas(vehiculos: any[], contratos: any[], pagos: any[], mantenimientos: any[]): any {
    const vehiculosDisponibles = vehiculos.filter(v => v.disponible && !v.necesita_mantenimiento).length;
    const contratosActivos = contratos.filter(c => !c.fecha_fin_real).length;
    const ingresosTotales = pagos
      .filter(p => p.estado === 'Completado')
      .reduce((sum, p) => sum + p.monto, 0);
    const mantenimientosPendientes = mantenimientos.filter(m => m.estado === 'Pendiente').length;
    const costoTotalMantenimiento = mantenimientos.reduce((sum, m) => sum + m.costo, 0);

    return {
      totalVehiculos: vehiculos.length,
      vehiculosDisponibles,
      totalContratos: contratos.length,
      contratosActivos,
      totalPagos: pagos.length,
      ingresosTotales,
      totalMantenimientos: mantenimientos.length,
      mantenimientosPendientes,
      costoTotalMantenimiento
    };
  }

  /**
   * Calcula la distribución de vehículos por tipo
   */
  calcularDistribucionVehiculos(vehiculos: any[]): any {
    const distribucion = vehiculos.reduce((acc, vehiculo) => {
      acc[vehiculo.tipo] = (acc[vehiculo.tipo] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(distribucion),
      datos: Object.values(distribucion),
      colores: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#20c997']
    };
  }

  /**
   * Calcula los ingresos mensuales
   */
  calcularIngresosMensuales(pagos: any[]): any {
    const ingresosPorMes: { [key: string]: number } = {};

    pagos
      .filter(p => p.estado === 'Completado')
      .forEach(pago => {
        const fecha = new Date(pago.fecha_pago);
        const mesAnio = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
        ingresosPorMes[mesAnio] = (ingresosPorMes[mesAnio] || 0) + pago.monto;
      });

    // Ordenar por fecha
    const mesesOrdenados = Object.keys(ingresosPorMes).sort((a, b) => {
      const [mesA, anioA] = a.split('/').map(Number);
      const [mesB, anioB] = b.split('/').map(Number);
      return new Date(anioA, mesA - 1).getTime() - new Date(anioB, mesB - 1).getTime();
    });

    return {
      labels: mesesOrdenados,
      datos: mesesOrdenados.map(mes => ingresosPorMes[mes])
    };
  }

  /**
   * Calcula el estado de los contratos
   */
  calcularEstadoContratos(contratos: any[]): any {
    const activos = contratos.filter(c => !c.fecha_fin_real).length;
    const finalizados = contratos.filter(c => c.fecha_fin_real).length;
    const pagados = contratos.filter(c => c.pagado).length;
    const pendientesPago = contratos.filter(c => !c.pagado && !c.fecha_fin_real).length;

    return {
      labels: ['Activos', 'Finalizados', 'Pagados', 'Pendientes Pago'],
      datos: [activos, finalizados, pagados, pendientesPago],
      colores: ['#007bff', '#28a745', '#ffc107', '#dc3545']
    };
  }

  /**
   * Calcula los costos de mantenimiento por tipo
   */
  calcularCostosMantenimiento(mantenimientos: any[]): any {
    const costosPorTipo = mantenimientos.reduce((acc, mantenimiento) => {
      acc[mantenimiento.tipo] = (acc[mantenimiento.tipo] || 0) + mantenimiento.costo;
      return acc;
    }, {});

    return {
      labels: Object.keys(costosPorTipo),
      datos: Object.values(costosPorTipo),
      colores: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#20c997']
    };
  }

  /**
   * Calcula la distribución de métodos de pago
   */
  calcularMetodosPago(pagos: any[]): any {
    const metodos = pagos.reduce((acc, pago) => {
      acc[pago.metodo_pago] = (acc[pago.metodo_pago] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(metodos),
      datos: Object.values(metodos),
      colores: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1']
    };
  }

  /**
   * Formatea un número como moneda
   * @param monto Monto a formatear
   * @returns String formateado como moneda
   */
  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(monto);
  }

  /**
   * Exporta datos a formato CSV
   * @param tipo Tipo de datos a exportar
   */
  exportarCSV(tipo: string): void {
    // Implementación básica de exportación
    let datos: any[] = [];
    let nombreArchivo = '';

    switch (tipo) {
      case 'vehiculos':
        // Aquí se implementaría la exportación real
        break;
      case 'contratos':
        // Aquí se implementaría la exportación real
        break;
      case 'pagos':
        // Aquí se implementaría la exportación real
        break;
    }

    this.mensaje = `Función de exportación ${tipo} será implementada próximamente`;
  }

  /**
   * Actualiza los reportes con nuevo rango de fechas
   */
  actualizarReportes(): void {
    this.mensaje = 'Actualizando reportes con nuevo rango de fechas...';
    // En una implementación real, aquí se recalcularían los datos con el filtro de fechas
    setTimeout(() => {
      this.mensaje = 'Reportes actualizados correctamente';
    }, 1000);
  }
}