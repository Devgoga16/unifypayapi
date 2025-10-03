#!/bin/bash

echo "🚀 Configurando UnifyPay API para Vercel..."

# Verificar si Git está inicializado
if [ ! -d ".git" ]; then
    echo "📁 Inicializando repositorio Git..."
    git init
    git add .
    git commit -m "Initial commit - UnifyPay API"
else
    echo "✅ Repositorio Git ya existe"
fi

# Verificar si hay cambios pendientes
if [[ `git status --porcelain` ]]; then
    echo "📝 Commiteando cambios pendientes..."
    git add .
    git commit -m "Configure for Vercel deployment"
fi

echo "📋 Checklist de configuración:"
echo "  ✅ vercel.json creado"
echo "  ✅ api/index.js creado"
echo "  ✅ server.js modificado para serverless"
echo "  ✅ Scripts de package.json actualizados"
echo "  ✅ .env.example creado"

echo ""
echo "🔧 Próximos pasos:"
echo "  1. Sube tu código a GitHub:"
echo "     git remote add origin https://github.com/tu-usuario/unifypayapi.git"
echo "     git push -u origin main"
echo ""
echo "  2. Ve a vercel.com e importa tu repositorio"
echo ""
echo "  3. Configura estas variables de entorno en Vercel:"
echo "     - NODE_ENV=production"
echo "     - MONGODB_URI=tu_connection_string_de_mongodb"
echo "     - JWT_SECRET=tu_clave_secreta"
echo ""
echo "  4. ¡Deploy y disfruta tu API en producción!"
echo ""
echo "📚 Documentación completa en: VERCEL_DEPLOY.md"
echo "🎉 ¡Listo para Vercel!"