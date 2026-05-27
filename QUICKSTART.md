# ⚡ Quick Start - GitHub MCP Server

## 30 segundos para empezar

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar TypeScript
npm run build

# 3. Verificar que todo funciona
npm run test -- --run

# Esperado: "30 passed"
```

## Probar inmediatamente

```bash
# Abre MCP Inspector en navegador
npx @modelcontextprotocol/inspector node dist/server.js
```

Ahora puedes:
- Ver los 5 tools disponibles
- Llenar formularios para cada uno
- Invocar tools manualmente
- Ver respuestas en tiempo real

## Configurar con tu token

1. Copiar template:
```bash
cp .env.example .env
```

2. Editar `.env` y agregar tu token:
```env
GITHUB_TOKEN=ghp_tu_token_aqui_no_con_esto
DEBUG=false
```

3. Obtener token en: https://github.com/settings/tokens

**Scopes requeridos**:
- `repo` - Acceso a repos
- `user` - Datos de usuario
- `admin:org` - (Opcional) Organizaciones

## Usar en producción (Antigravity)

1. Ir a Antigravity → Settings → MCP Servers
2. Agregar servidor:

```json
{
  "name": "github-mcp-server",
  "command": "node",
  "args": ["dist/server.js"],
  "env": {
    "GITHUB_TOKEN": "ghp_xxxxx",
    "DEBUG": "false"
  }
}
```

3. Click Connect ✅
4. Los 5 tools están disponibles para tu AI Agent

## ¿Qué puedo hacer?

| Tool | Descripción |
|------|------------|
| `create_repository` | Crear nuevos repos |
| `create_issue` | Abrir issues |
| `list_repositories` | Ver tus repos |
| `create_commit` | Agregar archivos |
| `list_issues` | Ver issues abiertos |

## Ejemplos de prompts

```
"Lista mis repositorios"
→ Usa: list_repositories({limit: 30})

"Crea un repo llamado 'mi-api' privado"
→ Usa: create_repository({name: 'mi-api', isPrivate: true})

"Abre un issue sobre un bug"
→ Usa: create_issue({owner: '...', repo: '...', title: '...'})
```

## ¿Problemas?

### Token inválido
```bash
# Regenerar en GitHub
# https://github.com/settings/tokens/new
```

### Tests fallan
```bash
npm run build
npm run test -- --run
```

### Logs detallados
```bash
DEBUG=true npx @modelcontextprotocol/inspector node dist/server.js
```

## ¿Qué incluye?

✅ 5 tools funcionales  
✅ 30 tests pasando  
✅ Validación Zod  
✅ Manejo de errores  
✅ Documentación completa  
✅ Listo para producción  

---

Para más detalles: [README.md](./README.md)  
Para testing: [TESTING.md](./TESTING.md)  
Estado completo: [STATUS.md](./STATUS.md)
