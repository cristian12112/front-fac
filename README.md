# 🏦 Sistema de Factoring - Frontend React

Sistema completo de gestión de factoring con diseño moderno y tendencias 2025. Actualmente funciona con datos mock en localStorage, listo para conectarse a un backend C# en el futuro.

## ✨ Características

- 🎨 **Diseño Moderno 2025**: Glassmorphism, gradientes animados, microinteracciones
- 🌙 **Dark Mode**: Soporte completo para modo oscuro
- 📱 **Responsive**: Adaptable a todos los dispositivos
- 🔔 **Notificaciones**: Sistema de notificaciones con Notyf
- 📊 **Exportación**: Descarga de facturas en XML, Excel y PDF
- 🔍 **Validación SUNAT**: Consulta automática de RUC con múltiples APIs
- 🧙‍♂️ **Wizard de Carga**: Proceso paso a paso para cargar facturas

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:5173](http://localhost:5173) en el navegador.

### Build para Producción

```bash
npm run build
```

### Preview de Producción

```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── pages/              # Páginas principales
│   ├── Login.jsx       # Login con glassmorphism
│   ├── Register.jsx    # Registro con diseño moderno
│   ├── Dashboard.jsx   # Dashboard con estadísticas
│   ├── Clients.jsx     # Gestión de clientes
│   ├── AddClient.jsx   # Agregar cliente con SUNAT
│   ├── EntidadesFinancieras.jsx  # Gestión de bancos
│   ├── Facturas.jsx    # Gestión de facturas
│   ├── CargarFactura.jsx  # Wizard de carga paso a paso
│   ├── Garantias.jsx   # Gestión de garantías
│   └── ContratosFactoring.jsx  # Contratos
├── components/         # Componentes reutilizables
│   └── Header.jsx      # Navegación principal
├── utils/             # Utilidades
│   ├── notify.js      # Sistema de notificaciones
│   ├── sunatApi.js    # Consulta de RUC en SUNAT
│   └── exportUtils.js # Exportación XML/Excel/PDF
└── styles/
    └── index.css      # Estilos globales y animaciones
```

## 🔧 Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Framework CSS utility-first
- **React Router DOM** - Enrutamiento SPA
- **Notyf** - Notificaciones toast modernas
- **XLSX** - Generación de archivos Excel
- **jsPDF** - Generación de PDFs
- **SUNAT APIs** - Validación de RUC

## 📋 Funcionalidades por Módulo

### 🔐 Autenticación
- Login con glassmorphism y animaciones
- Registro de usuarios
- Validación de formularios
- Sesión con localStorage (mock)

### 👥 Clientes
- CRUD completo de clientes
- Validación de RUC con SUNAT API
- Auto-completado de datos empresariales
- Campos: RUC, DNI, CE, Pasaporte
- Información CIIU y actividad económica

### 🏦 Entidades Financieras
- Gestión de bancos y financieras
- Tasas de interés
- Información de contacto
- Estados activo/inactivo

### 📄 Facturas
- Registro rápido con modal
- Wizard de carga paso a paso (5 pasos)
- Exportación a XML, Excel, PDF
- Estados: Pendiente, Aprobada, Rechazada, Pagada
- Tabla amplia con scroll horizontal
- Estadísticas en tiempo real

### 🔒 Garantías
- Gestión de garantías
- Tipos: Hipotecaria, Prendaria, Fianza
- Montos y vencimientos

### 📝 Contratos de Factoring
- Gestión de contratos
- Modalidades: Con Recurso, Sin Recurso
- Seguimiento de estados

## 🌐 API de SUNAT

El sistema integra consulta de RUC usando múltiples APIs públicas de SUNAT:

### APIs Disponibles

1. **API Principal**: `api.apis.net.pe`
2. **API Alternativa 1**: `dniruc.apisperu.com`
3. **API Alternativa 2**: `apiperu.dev`
4. **API Alternativa 3**: `consulta.api-peru.com`

### Datos que Auto-completa

- ✅ Razón Social
- ✅ Dirección fiscal
- ✅ Código CIIU
- ✅ Actividad económica
- ✅ Estado del contribuyente
- ✅ Condición del contribuyente
- ✅ Ubigeo (Departamento, Provincia, Distrito)

### Ejemplo de Uso

```javascript
import { buscarDatosRUC } from './utils/sunatApi'

const resultado = await buscarDatosRUC('20491222922')
if (resultado.success) {
  console.log(resultado.razonSocial)  // Nombre de la empresa
  console.log(resultado.direccion)     // Dirección fiscal
  console.log(resultado.ciiu)          // Código CIIU
}
```

## 🎨 Diseño y UX

### Tendencias 2025 Implementadas

- **Glassmorphism**: Efectos de vidrio translúcido
- **Gradientes Animados**: Blobs animados de fondo
- **Microinteracciones**: Hover states y transiciones suaves
- **Shadows Profundas**: Elevación de elementos
- **Tipografía Bold**: Jerarquía visual clara
- **Colores Vibrantes**: Paleta moderna y energética

### Componentes de UI

- Cards con gradientes
- Botones con estados hover
- Modales con backdrop blur
- Tablas responsivas con scroll
- Forms con validación visual
- Badges de estado coloridos
- Dropdowns con animaciones

## 📦 Datos Mock

El sistema utiliza localStorage para persistencia:

```javascript
// Claves de localStorage
'mock_user'              // Usuario autenticado
'mock_clients'           // Lista de clientes
'mock_entidades'         // Entidades financieras
'mock_facturas'          // Facturas
'mock_garantias'         // Garantías
'mock_contratos'         // Contratos de factoring
```

## 🔄 Migración a Backend

Para conectar con tu API C# backend:

1. Reemplazar operaciones de `localStorage` con `fetch()` o `axios`
2. Actualizar endpoints en cada página
3. Implementar manejo de tokens JWT
4. Configurar CORS en el backend

### Ejemplo de Migración

**Antes (Mock):**
```javascript
const clients = JSON.parse(localStorage.getItem('mock_clients') || '[]')
```

**Después (API Real):**
```javascript
const response = await fetch('https://api.tudominio.com/clients')
const clients = await response.json()
```

## 🛠️ Comandos Útiles

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build producción
npm run build

# Preview producción
npm run preview

# Limpiar caché
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notas Importantes

### SUNAT API
- Las APIs públicas pueden tener límites de rate limiting
- Se recomienda implementar caché en el backend
- El sistema prueba múltiples APIs automáticamente
- Algunas APIs pueden requerir CORS proxy en producción

### LocalStorage
- Los datos persisten solo en el navegador actual
- Limpiar caché del navegador borrará los datos
- No es seguro para producción, usar backend real

### Dark Mode
- Configurado con estrategia 'class'
- Persistencia en localStorage
- Toggle disponible en Header

## 🚧 Próximas Mejoras

- [ ] Integración con backend C# .NET
- [ ] Autenticación JWT real
- [ ] Upload de archivos al servidor
- [ ] Reportes y gráficos avanzados
- [ ] Notificaciones en tiempo real
- [ ] Exportación masiva de datos
- [ ] Búsqueda y filtros avanzados
- [ ] Paginación de tablas grandes

## 📄 Licencia

Este proyecto es de uso libre para desarrollo educativo y comercial.

## 👨‍💻 Desarrollo

Desarrollado con ❤️ usando React + Vite + Tailwind CSS

---

**Versión:** 1.0.0
**Última actualización:** 2025
