# PowerShell script para configurar Vercel
Write-Host "🚀 Configurando UnifyPay API para Vercel..." -ForegroundColor Green

# Verificar si Git está inicializado
if (-not (Test-Path ".git")) {
    Write-Host "📁 Inicializando repositorio Git..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit - UnifyPay API"
} else {
    Write-Host "✅ Repositorio Git ya existe" -ForegroundColor Green
}

# Verificar si hay cambios pendientes
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📝 Commiteando cambios pendientes..." -ForegroundColor Yellow
    git add .
    git commit -m "Configure for Vercel deployment"
}

Write-Host ""
Write-Host "📋 Checklist de configuración:" -ForegroundColor Cyan
Write-Host "  ✅ vercel.json creado" -ForegroundColor Green
Write-Host "  ✅ api/index.js creado" -ForegroundColor Green
Write-Host "  ✅ server.js modificado para serverless" -ForegroundColor Green
Write-Host "  ✅ Scripts de package.json actualizados" -ForegroundColor Green
Write-Host "  ✅ .env.example creado" -ForegroundColor Green

Write-Host ""
Write-Host "🔧 Próximos pasos:" -ForegroundColor Magenta
Write-Host "  1. Sube tu código a GitHub:" -ForegroundColor White
Write-Host "     git remote add origin https://github.com/tu-usuario/unifypayapi.git" -ForegroundColor Gray
Write-Host "     git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Ve a vercel.com e importa tu repositorio" -ForegroundColor White
Write-Host ""
Write-Host "  3. Configura estas variables de entorno en Vercel:" -ForegroundColor White
Write-Host "     - NODE_ENV=production" -ForegroundColor Gray
Write-Host "     - MONGODB_URI=tu_connection_string_de_mongodb" -ForegroundColor Gray
Write-Host "     - JWT_SECRET=tu_clave_secreta" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. ¡Deploy y disfruta tu API en producción!" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentación completa en: VERCEL_DEPLOY.md" -ForegroundColor Cyan
Write-Host "🎉 ¡Listo para Vercel!" -ForegroundColor Green

# Pausar para que el usuario pueda leer
Read-Host "Presiona Enter para continuar..."