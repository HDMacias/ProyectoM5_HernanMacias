# 🚀 GitHub MCP Server - AutomateHub

Un servidor **Model Context Protocol (MCP)** que permite que agentes de IA automaticen tareas en GitHub usando lenguaje natural.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [¿Por qué es útil?](#por-qué-es-útil)
- [Requisitos del Sistema](#requisitos-del-sistema)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Documentación de Tools](#documentación-de-tools)
- [Arquitectura](#arquitectura)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Licencia](#licencia)

---

## 📖 Descripción

**GitHub MCP Server** es una implementación del **Model Context Protocol** que expone 5 tools principales para automatizar operaciones comunes en GitHub:

- ✅ Crear repositorios
- ✅ Crear issues
- ✅ Listar repositorios
- ✅ Crear commits (agregar/modificar archivos)
- ✅ Listar issues

El servidor se comunica con un **LLM** (como Claude, Gemini, etc.) a través de **Antigravity**, permitiendo que los usuarios den comandos en lenguaje natural para automatizar tareas en GitHub.

### Ejemplo de uso con un AI Agent:

```
Usuario: "Crea un nuevo repositorio llamado 'mi-proyecto' con descripción 'Un proyecto increíble'"
↓
Agent (via MCP): Invoca tool → create_repository({name: 'mi-proyecto', description: '...'})
↓
MCP Server: Valida y ejecuta via GitHub API
↓
Resultado: Repositorio creado exitosamente
```

---

## 💡 ¿Por qué es útil?

1. **Automatización**: Automatiza tareas repetitivas en GitHub sin interface gráfica
2. **Lenguaje Natural**: Los usuarios dan órdenes en español/inglés, no comandos técnicos
3. **Integración de IA**: Permite que AI Agents gestionen GitHub programáticamente
4. **Escalabilidad**: Fácil de extender con nuevos tools
5. **Seguridad**: Token de acceso nunca se expone al usuario
6. **Validación**: Zod asegura que los datos sean válidos antes de llegar a GitHub

### Casos de Uso:

- 📊 **Gestión Ágil**: Un agente crea issues automáticamente desde conversaciones
- 🔄 **CI/CD Augmentado**: Combina IA con procesos de deployments
- 📝 **Documentación Automática**: Genera commits con cambios documentados
- 🤝 **Automatización de Equipos**: Gestión centralizada de múltiples repositorios

---

## 🖥️ Requisitos del Sistema

- **Node.js**: 18 o superior
- **npm**: 9 o superior
- **Git**: Para clonar y pushear
- **GitHub Personal Access Token**: Con scopes adecuados
- **RAM**: Mínimo 256MB
- **Conexión a Internet**: Para acceder a GitHub API

### Verificar versiones:

```bash
node --version    # v18.0.0 o superior
npm --version     # 9.0.0 o superior
git --version     # 2.0.0 o superior
```

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/HDMacias/ProyectoM5_HernanMacias.git
cd ProyectoM5_HernanMacias/github-mcp-server
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Compilar TypeScript

```bash
npm run build
```

Esto generará el directorio `dist/` con JavaScript compilado.

### 4. Verificar la instalación

```bash
npm run test
```

Deberías ver **16+ tests pasando** con colores verdes. ✅

---

## 🔑 Configuración

### Obtener GitHub Personal Access Token

1. Ir a https://github.com/settings/tokens/new
2. Seleccionar los siguientes **scopes**:
   - `repo` - Acceso completo a repositorios públicos y privados
   - `user` - Acceso a datos del usuario
   - `admin:org` - (Opcional) Si quieres gestionar organizaciones
3. Copiar el token (⚠️ **Nunca lo compartas**)

### Configurar variables de entorno

1. Copiar `.env.example` a `.env`:

```bash
cp .env.example .env
```

2. Editar `.env` y agregar tu token:

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DEBUG=false
```

3. **Nunca** commitear el archivo `.env` (ya está en `.gitignore`)

### Configurar en Antigravity

1. Abre **Antigravity IDE**
2. Ve a **Settings** → **MCP Servers**
3. Haz clic en **Add Server** y completa:

```json
{
  "name": "github-mcp-server",
  "command": "node",
  "args": ["dist/server.js"],
  "env": {
    "GITHUB_TOKEN": "tu_token_aqui",
    "DEBUG": "false"
  }
}
```

4. Haz clic en **Connect**
5. Deberías ver: ✅ "GitHub MCP Server iniciado y escuchando..."

---

## 🛠️ Documentación de Tools

### 1. `create_repository`

**Descripción**: Crea un nuevo repositorio en GitHub para el usuario autenticado.

**Parámetros**:

```typescript
{
  name: string;           // Requerido. Entre 3-100 caracteres. Solo letras, números, -, ., _
  description?: string;   // Opcional. Hasta 350 caracteres
  isPrivate?: boolean;    // Opcional. Por defecto false (público)
}
```

**Ejemplo de prompt efectivo**:

```
"Crea un repositorio llamado 'mi-api' con descripción 'API REST en Node.js' y que sea privado"
```

**Respuesta esperada**:

```
Repositorio "mi-api" creado exitosamente.
URL: https://github.com/tu-usuario/mi-api
Visibilidad: Privado
```

---

### 2. `create_issue`

**Descripción**: Abre un nuevo issue en un repositorio de GitHub.

**Parámetros**:

```typescript
{
  owner: string;          // Requerido. Usuario u organización dueña del repo
  repo: string;           // Requerido. Nombre del repositorio
  title: string;          // Requerido. Entre 1-256 caracteres
  body?: string;          // Opcional. Descripción detallada del issue
}
```

**Ejemplo de prompt efectivo**:

```
"Crea un issue en HDMacias/mi-api con título 'Bug: Error 500 en POST /users' y descripción 'El endpoint falla con error 500 cuando el email es inválido'"
```

**Respuesta esperada**:

```
Issue #42 creado exitosamente.
Título: Bug: Error 500 en POST /users
URL: https://github.com/HDMacias/mi-api/issues/42
```

---

### 3. `list_repositories`

**Descripción**: Lista los repositorios del usuario autenticado en GitHub.

**Parámetros**:

```typescript
{
  limit?: number;  // Opcional. Entre 1-100. Por defecto 30
}
```

**Ejemplo de prompt efectivo**:

```
"Muéstrame mis últimos 10 repositorios"
```

**Respuesta esperada**:

```
Se encontraron 10 repositorios:

- mi-api (Público) → https://github.com/tu-usuario/mi-api
- proyecto-web (Privado) → https://github.com/tu-usuario/proyecto-web
...
```

---

### 4. `create_commit`

**Descripción**: Crea un commit agregando o modificando un archivo en un repositorio.

**Parámetros**:

```typescript
{
  owner: string;      // Requerido. Usuario u organización dueña del repo
  repo: string;       // Requerido. Nombre del repositorio
  message: string;    // Requerido. Mensaje descriptivo del commit
  filename: string;   // Requerido. Ruta del archivo (ej: src/index.ts)
  content: string;    // Requerido. Contenido del archivo en texto plano
}
```

**Ejemplo de prompt efectivo**:

```
"Crea un commit en HDMacias/mi-api que agregue un archivo 'package.json' con contenido '{\"name\": \"mi-api\", \"version\": \"1.0.0\"}' y mensaje 'init: setup inicial del proyecto'"
```

**Respuesta esperada**:

```
Commit creado exitosamente.
Archivo: package.json
Mensaje: init: setup inicial del proyecto
URL: https://github.com/HDMacias/mi-api/blob/main/package.json
```

---

### 5. `list_issues`

**Descripción**: Lista los issues abiertos de un repositorio específico en GitHub.

**Parámetros**:

```typescript
{
  owner: string;  // Requerido. Usuario u organización dueña del repo
  repo: string;   // Requerido. Nombre del repositorio
}
```

**Ejemplo de prompt efectivo**:

```
"Muéstrame todos los issues abiertos en HDMacias/mi-api"
```

**Respuesta esperada**:

```
Issues abiertos en HDMacias/mi-api (3):

- #42 Bug: Error 500 en POST /users → https://github.com/HDMacias/mi-api/issues/42
- #38 Feature: Agregar autenticación JWT → https://github.com/HDMacias/mi-api/issues/38
- #35 Docs: Actualizar README → https://github.com/HDMacias/mi-api/issues/35
```

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Antigravity (Host)                        │
│              ┌─────────────────────────────┐                │
│              │   AI Agent / LLM             │                │
│              │  (Claude, Gemini, etc.)      │                │
│              └──────────────┬───────────────┘                │
│                             │                                │
│                    JSON-RPC via stdio                        │
│                             │                                │
└──────────────────────────────┼────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  MCP Server         │
                    │ (Node.js + TS)      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
        ┌─────▼────┐    ┌─────▼────┐    ┌────▼─────┐
        │  Tools   │    │ Schemas  │    │  Errors  │
        │(5 tools) │    │(Zod)     │    │(Classes) │
        └─────┬────┘    └─────┬────┘    └────┬─────┘
              │                │              │
        ┌─────▼────────────────▼──────────────▼────┐
        │      GitHub Operations Layer             │
        │  (Validación + GitHub API calls)         │
        └──────────────────┬───────────────────────┘
                           │
                    ┌──────▼───────┐
                    │ Octokit       │
                    │ GitHub API    │
                    └───────────────┘
```

### Flujo de una solicitud:

1. **User Input**: Usuario da comando en lenguaje natural
2. **LLM Decision**: El LLM decide cuál tool usar
3. **MCP Server**: Recibe la invocación del tool
4. **Validación**: Zod valida los parámetros
5. **Operación**: Se llama a GitHub via Octokit
6. **Transformación**: Errores técnicos se convierten a mensajes humanos
7. **Respuesta**: Resultado se envía de vuelta al LLM/Usuario

---

## 🧪 Testing

### Ejecutar todos los tests

```bash
npm run test
```

### Ejecutar tests en modo watch (desarrollo)

```bash
npm run test -- --watch
```

### Ejecutar tests de un archivo específico

```bash
npm run test -- tests/schemas.test.ts
```

### Ver cobertura de tests

```bash
npm run test -- --coverage
```

### Qué se prueba

✅ **Validación de Schemas** (6 tests)
- Nombres de repo válidos/inválidos
- Parámetros requeridos/opcionales
- Límites de caracteres
- Formatos especiales

✅ **Manejo de Errores** (10+ tests)
- Error 404 (recurso no encontrado)
- Error 401/403 (autenticación/autorización)
- Error 429 (rate limit)
- Transformación a mensajes humanos

---

## 🛠️ Scripts npm

```bash
npm run build   # Compilar TypeScript a JavaScript
npm run dev     # Ejecutar servidor en modo desarrollo
npm run test    # Ejecutar tests con Vitest
npm run lint    # Verificar sintaxis TypeScript
```

---

## 🔍 Troubleshooting

### ❌ Error: "GITHUB_TOKEN no está definido"

**Solución**:
```bash
cp .env.example .env
# Editar .env y agregar tu token
```

### ❌ Error: "Token inválido o sin permisos suficientes"

**Solución**:
1. Verifica el token en https://github.com/settings/tokens
2. Asegúrate que tenga los scopes: `repo`, `user`, `admin:org`
3. Si fue creado hace mucho, crea uno nuevo

### ❌ Error: "Recurso no encontrado (404)"

**Solución**:
1. Verifica que el owner/repo existan
2. Usa `list_repositories` para ver tus repos
3. Comprueba que tienes acceso al repositorio

### ❌ Error: "Rate limit excedido (429)"

**Solución**:
1. El servidor reintentar automáticamente con exponential backoff
2. Si persiste, espera 1 hora y vuelve a intentar
3. GitHub permite 5000 requests/hora para usuarios autenticados

### ❌ Tests fallan en CI/CD

**Solución**:
```bash
# Limpiar cache de npm
npm ci

# Reinstalar node_modules
rm -rf node_modules
npm install

# Ejecutar tests
npm run test
```

### ℹ️ Ver logs detallados

Configurar en `.env`:

```env
DEBUG=true
```

Verás logs de cada operación en stderr.

---

## 📊 Estructura del Proyecto

```
github-mcp-server/
├── src/
│   ├── server.ts              # Entry point del MCP server
│   ├── types.ts               # Tipos TypeScript compartidos
│   ├── tools/
│   │   ├── create-repository.ts
│   │   ├── create-issue.ts
│   │   ├── list-repositories.ts
│   │   ├── create-commit.ts
│   │   └── list-issues.ts
│   ├── github/
│   │   ├── client.ts          # Inicialización de Octokit
│   │   └── operations.ts      # Funciones que llaman GitHub API
│   ├── schemas/
│   │   └── index.ts           # Validaciones Zod
│   ├── errors/
│   │   └── index.ts           # Clases de error y transformación
│   └── utils/
│       ├── logging.ts         # Logs a stderr
│       └── retry.ts           # Retry logic con exponential backoff
├── tests/
│   └── schemas.test.ts        # Tests con Vitest (16+)
├── dist/                      # Salida compilada (gitignored)
├── .env                       # Variables de entorno (gitignored)
├── .env.example               # Template de .env
├── .gitignore
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## 📜 Licencia

MIT License - Libre para usar, modificar y distribuir.

```
Copyright (c) 2024 Hernán Macías - AutomateHub

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

---

## 🤝 Contribuciones

¿Quieres mejorar este proyecto?

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/mi-feature`)
3. Commit los cambios (`git commit -m 'feat: agregué nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/mi-feature`)
5. Abre un Pull Request

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa el apartado **Troubleshooting**
2. Verifica tu `.env` tiene el token correcto
3. Ejecuta `npm run test` para diagnóstico
4. Abre un issue en GitHub

---

## 🎯 Próximos pasos

Tools adicionales en el roadmap:

- [ ] `create_pull_request` - Crear PRs entre branches
- [ ] `close_issue` - Cerrar issues
- [ ] `add_comment_to_issue` - Comentar en issues
- [ ] `create_branch` - Crear branches
- [ ] `assign_issue` - Asignar issues a usuarios
- [ ] `create_label` - Crear labels personalizados

---

**Hecho con ❤️ por AutomateHub**
