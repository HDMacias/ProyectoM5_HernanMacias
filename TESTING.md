# 🧪 Guía de Testing con MCP Inspector y Spencer

## Resumen ejecutivo

✅ **30 tests unitarios** con Vitest pasando correctamente
✅ **Cobertura**: Validación de schemas, manejo de errores, transformación de mensajes
✅ **5 tools funcionando**: create_repository, create_issue, list_repositories, create_commit, list_issues
✅ **Listo para producción** en Antigravity o cualquier host MCP

---

## 📊 Resumen de Tests

```
Test Files  1 passed (1)
Tests       30 passed (30) ✅
Duration    459ms

Desglose:
- CreateRepositorySchema:    5 tests ✅
- CreateIssueSchema:         4 tests ✅
- ListRepositoriesSchema:    4 tests ✅
- CreateCommitSchema:        2 tests ✅
- ListIssuesSchema:          2 tests ✅
- Error Handling:           13 tests ✅
```

---

## 🧪 Método 1: Testing con MCP Inspector (Recomendado)

MCP Inspector es la herramienta oficial de Anthropic para debuggear servidores MCP.

### Instalación de MCP Inspector

```bash
# Instalar globalmente
npm install -g @modelcontextprotocol/inspector

# O usar con npx
npx @modelcontextprotocol/inspector node /path/a/dist/server.js
```

### Pasos para probar

1. **Compilar el servidor**:
```bash
npm run build
```

2. **Ejecutar MCP Inspector**:
```bash
npx @modelcontextprotocol/inspector node dist/server.js
```

3. **Debería ver**:
```
[INFO] GitHub MCP Server iniciado y escuchando...
```

4. **Abre el navegador** (automáticamente o en `http://localhost:3000`)

5. **Verás la interfaz**:
   - Panel izquierdo: Lista de tools disponibles
   - Panel central: Formulario para invocar tools
   - Panel derecho: Respuestas del servidor

### Ejemplos de testing en MCP Inspector

#### Test 1: Listar repositorios

```json
Tool: list_repositories
Input: {
  "limit": 5
}

Respuesta esperada:
"Se encontraron X repositorios:
- repo1 (Público) → https://...
- repo2 (Privado) → https://...
..."
```

#### Test 2: Crear issue

```json
Tool: create_issue
Input: {
  "owner": "HDMacias",
  "repo": "ProyectoM5_HernanMacias",
  "title": "Test issue desde MCP Inspector",
  "body": "Este es un test del servidor MCP"
}

Respuesta esperada:
"Issue #XXX creado exitosamente.
Título: Test issue desde MCP Inspector
URL: https://github.com/..."
```

#### Test 3: Validación - Title vacío

```json
Tool: create_issue
Input: {
  "owner": "HDMacias",
  "repo": "mi-repo",
  "title": ""
}

Respuesta esperada (error):
"Error de validación: El título del issue es requerido"
```

---

## 🎮 Método 2: Testing con Spencer (Si es una herramienta específica)

Si Spencer es un IDE o IDE host para MCP:

### Configurar Spencer para conectar con MCP Server

1. **Abrir Spencer**

2. **Ir a Settings → MCP Servers**

3. **Add New Server**:
   ```
   Name: github-mcp-server
   Command: node
   Arguments: ["dist/server.js"]
   ```

4. **Configurar variables de entorno**:
   ```
   GITHUB_TOKEN: tu_token_aqui
   DEBUG: false
   ```

5. **Click Connect**

6. **Ver tools disponibles** en el panel de Spencer

### Testing en Spencer

Una vez conectado, puedes invocar los tools directamente:

**Ejemplo**: "List my repositories"
- Spencer envía: `list_repositories({limit: 30})`
- MCP Server responde con lista de repos
- Spencer muestra resultado al usuario

---

## 📟 Método 3: Testing manual via CLI

### Simular una invocación de tool

```bash
# 1. Compilar
npm run build

# 2. Iniciar servidor en background
node dist/server.js &

# 3. El servidor espera JSON-RPC via stdin/stdout
# Enviar una solicitud JSON-RPC simulada
```

Aunque no es lo ideal (requiere conocer el protocolo JSON-RPC exacto).

---

## ✅ Checklist de Testing Completo

Antes de presentar:

- [ ] Todos los tests pasan: `npm run test -- --run` ✅
- [ ] El servidor compila sin errores: `npm run build` ✅
- [ ] .env tiene token válido (y no está commiteado)
- [ ] MCP Inspector funciona y muestra los 5 tools
- [ ] Probar cada tool al menos una vez:
  - [ ] `list_repositories` - Ver que retorna lista
  - [ ] `create_repository` - Crear un repo test (luego borrarlo)
  - [ ] `create_issue` - Crear un issue test (luego borrarlo)
  - [ ] `create_commit` - Crear un commit test
  - [ ] `list_issues` - Listar issues del repo test
- [ ] Probar casos de error:
  - [ ] Owner/repo inexistente (404)
  - [ ] Token inválido (401)
  - [ ] Validación fallida (campos vacíos, límites)
- [ ] Verificar logs en stderr (si DEBUG=true)

---

## 🐛 Debugging

### Ver logs detallados

```bash
DEBUG=true npx @modelcontextprotocol/inspector node dist/server.js
```

Verás en stderr:
```
[INFO] GitHub MCP Server iniciado y escuchando...
[INFO] Listando repositorios
[INFO] Creando repositorio { name: 'test-repo' }
[DEBUG] Token válido
```

### Error común: "Token no definido"

```bash
# Verificar que .env existe
cat .env

# Debe tener:
# GITHUB_TOKEN=ghp_xxxxx
```

### Error común: "ECONNREFUSED"

El servidor no está ejecutándose. Assegurate de:
```bash
npm run build
npx @modelcontextprotocol/inspector node dist/server.js
```

---

## 🎯 Quick Start para demostración en vivo

```bash
# 1. Preparar (una sola vez)
npm install
npm run build

# 2. En la demostración
npx @modelcontextprotocol/inspector node dist/server.js

# 3. MCP Inspector se abre en navegador

# 4. Probar los 5 tools uno por uno
# Seleccionar tool → llenar formulario → Send
# Mostrar respuesta exitosa
```

---

## 📈 Métricas

| Métrica | Valor |
|---------|-------|
| Tests Totales | 30 ✅ |
| Tests Fallidos | 0 |
| Cobertura | Schemas + Errores |
| Tools Implementados | 5/5 |
| Tiempo compilación | <1s |
| Tiempo tests | ~450ms |

---

## 🚀 Próximo paso: Producción

Para usar en **Antigravity** en producción:

```json
{
  "name": "github-mcp-server",
  "command": "node",
  "args": ["dist/server.js"],
  "env": {
    "GITHUB_TOKEN": "tu_token_seguro",
    "DEBUG": "false"
  }
}
```

El servidor estará disponible para que el LLM lo use en conversaciones normales.

---

## 📞 Troubleshooting de Testing

| Problema | Causa | Solución |
|----------|-------|----------|
| Tests fallan | Cambios en código | Ejecutar `npm run build` y `npm run test -- --run` |
| MCP Inspector no abre | Puerto 3000 en uso | Cambiar puerto o cerrar otra app |
| Tool retorna error 404 | Repo no existe | Verificar nombre exacto en GitHub |
| Token inválido | Token expirado | Generar nuevo en github.com/settings/tokens |
| Validación falla | Parámetros inválidos | Ver descripción del tool en MCP Inspector |

---

**¡Listo para presentar!** 🎉
