# Sistema de Alquiler de Vehículos – Frontend

Aplicación Angular para la gestión de un sistema de alquiler de vehículos. Incluye autenticación, barra lateral, dashboard y módulos para administrar todas las entidades del sistema.

## Características Principales

### Autenticación
- Inicio de sesión.
- Persistencia de sesión mediante localStorage.
- Cierre de sesión seguro.

### Navegación
- Barra lateral fija con acceso a todos los módulos.
- Cambio dinámico entre componentes.
- Dashboard inicial al autenticarse.

### Dashboard
- Tarjetas con estadísticas principales:
  - Vehículos disponibles
  - Contratos activos
  - Ingresos del mes
  - Mantenimientos pendientes

### Módulos Incluidos
- Login
- Gestión de Vehículos
- Gestión de Clientes
- Gestión de Contratos
- Gestión de Pagos
- Gestión de Mantenimientos
- Reportes

## Requisitos Previos
- Node.js 18+
- Angular CLI 17+
- Backend REST disponible.

## Instalación

1. Clonar el repositorio  
   git clone <https://github.com/nagneto6325/frontend_alquiler_vehiculos.git>

2. Instalar dependencias  
   npm install

3. Ejecutar servidor de desarrollo  
   ng serve -o

La aplicación estará disponible en:
http://localhost:4200

## Estructura del Proyecto

src/  
├── app/  
│   ├── components/  
│   │   ├── login/  
│   │   ├── gestion-vehiculos/  
│   │   ├── gestion-clientes/  
│   │   ├── gestion-contratos/  
│   │   ├── gestion-pagos/  
│   │   ├── gestion-mantenimientos/  
│   │   └── reportes/  
│   ├── app.component.ts  
│   ├── app.component.html  
│   ├── app.component.css  
│   └── app.module.ts  
├── assets/  
└── index.html  

## Sesión y Estado
- El token se almacena en localStorage como authToken.
- Los datos del usuario se guardan en userData.
- La sección activa se mantiene en memoria.

## Compilación para Producción

ng build

Los archivos finales se generarán en la carpeta dist/.

## Notas
- Font Awesome es requerido para los iconos.
- Todos los componentes deben declararse en app.module.ts para evitar errores NG8001.
