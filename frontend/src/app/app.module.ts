import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { GestionVehiculosComponent } from './components/gestion-vehiculos/gestion-vehiculos.component';
import { GestionClientesComponent } from './components/gestion-clientes/gestion-clientes.component';
import { GestionContratosComponent } from './components/gestion-contratos/gestion-contratos.component';
import { GestionPagosComponent } from './components/gestion-pagos/gestion-pagos.component';
import { GestionMantenimientosComponent } from './components/gestion-mantenimientos/gestion-mantenimientos.component';
import { ReportesComponent } from './components/reportes/reportes.component';

/**
 * Módulo principal de la aplicación Angular que define
 * la estructura modular y las dependencias del sistema
 */
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GestionVehiculosComponent,
    GestionClientesComponent,
    GestionContratosComponent,
    GestionPagosComponent,
    GestionMantenimientosComponent,
    ReportesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }