import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

/**
 * Punto de entrada principal de la aplicación Angular
 * Inicializa y arranca el módulo principal de la aplicación
 */
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error('Error al inicializar la aplicación:', err));