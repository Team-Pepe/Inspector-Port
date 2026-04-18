# Guía de Trabajo con Tauri - Inspector Ports

## Arquitectura Modular del Proyecto

Este proyecto utiliza una arquitectura modular donde cada vista tiene su propia lógica completa. La estructura está organizada de la siguiente manera:

```
src/
├── components/                 # Componentes compartidos/reutilizables
│   ├── common/
│   │   ├── Sidebar.tsx         # Barra lateral de navegación
│   │   ├── Header.tsx          # Encabezado superior con búsqueda/acciones
│   │   ├── MetricsCard.tsx     # Tarjetas de estadísticas (estilo bento)
│   │   ├── DataTable.tsx       # Componente de tabla reutilizable
│   │   ├── ProgressBar.tsx     # Gráficos/barras
│   │   ├── StatusBadge.tsx     # Indicadores TCP/UDP/estado
│   │   ├── Button.tsx          # Botones personalizados
│   │   └── Modal.tsx           # Diálogos para acciones
│   └── ui/                     # Primitivos básicos de UI
├── views/                      # Módulos de características
│   ├── Dashboard/              # Página de resumen
│   │   ├── Dashboard.tsx
│   │   ├── components/
│   │   ├── stores/
│   │   └── types.ts
│   ├── Network/                # Inspección de puertos (vista principal)
│   │   ├── Network.tsx
│   │   ├── components/         # PortTable, BandwidthChart, etc.
│   │   ├── stores/             # Datos de red y filtros
│   │   ├── services/           # Llamadas a API de Tauri
│   │   └── types.ts            # Connection, PortData
│   ├── Resources/              # Monitoreo de recursos del sistema
│   │   ├── Resources.tsx
│   │   ├── components/
│   │   ├── stores/
│   │   └── types.ts
│   ├── AIAssistant/            # Interfaz de chat IA
│   │   ├── AIAssistant.tsx
│   │   ├── components/
│   │   ├── stores/
│   │   └── types.ts
│   └── Settings/               # Configuración
│       ├── Settings.tsx
│       ├── components/
│       ├── stores/
│       └── types.ts
├── stores/                     # Estado global (tema, usuario, notificaciones)
├── services/                   # Abstracción de API de Tauri
├── utils/                      # Ayudantes, formateadores, constantes
├── types/                      # Tipos globales
├── App.tsx                     # Raíz con enrutamiento/diseño
├── index.tsx                   # Punto de entrada
├── assets/                     # Recursos del diseño
└── styles/                     # Configuración de Tailwind, temas
```

## Cómo Trabajar con Tauri

### 1. Arquitectura General
- **Frontend**: SolidJS + TypeScript + TailwindCSS
- **Backend**: Rust (Tauri)
- **Comunicación**: IPC (Inter-Process Communication) entre frontend y backend

### 2. Estructura del Backend (src-tauri/)
```
src-tauri/
├── src/
│   ├── main.rs          # Punto de entrada principal
│   ├── lib.rs           # Librería con comandos Tauri
│   └── [módulos]/       # Módulos específicos (network, system, etc.)
├── Cargo.toml           # Dependencias Rust
├── tauri.conf.json      # Configuración Tauri
└── icons/               # Íconos de la aplicación
```

### 3. Comunicación Frontend-Backend

#### Llamadas desde Frontend
```typescript
import { invoke } from '@tauri-apps/api/core';

// Llamada básica
const result = await invoke('command_name', { param1: 'value' });

// Con manejo de errores
try {
  const data = await invoke('get_network_ports');
  console.log(data);
} catch (error) {
  console.error('Error:', error);
}
```

#### Definición de Comandos en Rust
```rust
// En lib.rs o en módulos específicos
#[tauri::command]
async fn get_network_ports() -> Result<Vec<PortInfo>, String> {
    // Lógica para obtener información de puertos
    Ok(ports)
}

// Registrar comandos
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_network_ports])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 4. Servicios de API

Crea servicios en `src/services/` para abstraer las llamadas a Tauri:

```typescript
// src/services/networkService.ts
import { invoke } from '@tauri-apps/api/core';

export interface PortInfo {
  pid: number;
  name: string;
  protocol: 'TCP' | 'UDP';
  localAddress: string;
  remoteAddress: string;
  status: string;
}

export class NetworkService {
  static async getActivePorts(): Promise<PortInfo[]> {
    return await invoke('get_active_ports');
  }

  static async getNetworkStats(): Promise<NetworkStats> {
    return await invoke('get_network_stats');
  }

  static async flushRules(): Promise<void> {
    return await invoke('flush_network_rules');
  }
}
```

### 5. Gestión de Estado

Usa SolidJS signals para estado local y stores para estado global:

```typescript
// src/stores/networkStore.ts
import { createStore } from 'solid-js/store';

interface NetworkState {
  ports: PortInfo[];
  loading: boolean;
  filters: {
    protocol: string;
    status: string;
  };
}

const [networkState, setNetworkState] = createStore<NetworkState>({
  ports: [],
  loading: false,
  filters: {
    protocol: '',
    status: ''
  }
});

export { networkState, setNetworkState };
```

### 6. Convenciones de Código

#### Componentes
- Usa PascalCase para nombres de componentes
- Props deben ser tipadas con interfaces
- Maneja eventos con funciones on[Event]

#### Archivos
- `.tsx` para componentes con JSX
- `.ts` para lógica pura
- Un componente por archivo
- Exports nombrados por defecto

#### Estilos
- Usa clases de Tailwind directamente en JSX
- Para estilos complejos, usa `@layer` en CSS
- Sigue el sistema de colores definido en `tailwind.config.js`

### 7. Desarrollo y Construcción

#### Comandos de Desarrollo
```bash
# Frontend solo
pnpm dev

# Backend solo (Rust)
cd src-tauri && cargo build

# Aplicación completa
pnpm tauri dev

# Construir para producción
pnpm tauri build
```

#### Debugging
- Usa `console.log()` en frontend
- Usa `println!()` en Rust
- Para IPC: verifica que los nombres de comandos coincidan
- Revisa la consola del navegador y logs de Tauri

### 8. Arquitectura Simétrica

El backend debe reflejar la modularidad del frontend:

- **Network Module**: Maneja inspección de puertos, conexiones TCP/UDP
- **System Module**: Monitoreo de CPU, memoria, disco
- **Security Module**: Análisis de procesos sospechosos, reglas de firewall
- **AI Module**: Integración con servicios de IA para análisis

Cada módulo backend debe tener:
- Funciones específicas bien documentadas
- Tipos de datos consistentes con el frontend
- Manejo adecuado de errores
- Logging para debugging

### 9. Seguridad

- Nunca expongas datos sensibles en el frontend
- Valida todas las entradas del usuario
- Usa permisos mínimos en `tauri.conf.json`
- Implementa rate limiting en comandos críticos

### 10. Testing

- Pruebas unitarias: Vitest para frontend, cargo test para Rust
- Pruebas de integración: Verificar comunicación IPC
- Pruebas E2E: Playwright o similar para flujos completos

## Próximos Pasos

1. Implementar servicios de Tauri para cada módulo
2. Crear tipos TypeScript que coincidan con structs de Rust
3. Desarrollar componentes específicos para cada vista
4. Implementar gestión de estado global
5. Agregar tests y documentación adicional