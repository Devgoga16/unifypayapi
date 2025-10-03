# Sistema de Archivos Adjuntos

## Descripción
El sistema permite subir archivos adjuntos a las transacciones y almacenarlos como base64 en la base de datos MongoDB.

## Funcionalidad

### Campos en el Modelo Transaction
- `archivo_adjunto`: String con el contenido del archivo en base64 (sin el prefijo data URL)
- `archivo_nombre`: String con el nombre original del archivo
- `archivo_tipo`: String con el tipo MIME del archivo
- `archivo_tamaño`: Number con el tamaño del archivo en bytes

### Tipos de Archivo Permitidos
- Imágenes: JPG, JPEG, PNG
- Documentos: PDF, TXT

### Límites
- Tamaño máximo: 5MB por archivo
- Solo un archivo por transacción

## Uso de la API

### Crear Transacción con Archivo

```bash
POST /api/transactions
Content-Type: application/json

{
  "descripcion_transaccion": "Pago de servicios",
  "monto_transaccion": 150.00,
  "tipo_transaccion": "egreso",
  "moneda": "USD",
  "medio_pago": "tarjeta",
  "estado": "confirmada",
  "archivo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
  "archivo_nombre": "recibo_pago.jpg"
}
```

### Actualizar Transacción con Archivo

```bash
PUT /api/transactions/{id}
Content-Type: application/json

{
  "descripcion_transaccion": "Descripción actualizada",
  "archivo": "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9ia...",
  "archivo_nombre": "factura_actualizada.pdf"
}
```

## Formato del Campo `archivo`

El campo `archivo` debe enviarse como un data URL completo:
```
data:{mime_type};base64,{base64_content}
```

Ejemplos:
- `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...`
- `data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9ia...`

## Validaciones

### En el Frontend (JavaScript)
```javascript
function validarArchivo(file) {
  // Validar tipo
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'text/plain'];
  if (!tiposPermitidos.includes(file.type)) {
    throw new Error('Tipo de archivo no permitido');
  }
  
  // Validar tamaño (5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Archivo muy grande');
  }
  
  return true;
}

function convertirABase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Uso
const archivo = document.getElementById('file-input').files[0];
if (archivo) {
  validarArchivo(archivo);
  const base64 = await convertirABase64(archivo);
  
  const transaccion = {
    descripcion_transaccion: "Mi transacción",
    monto_transaccion: 100,
    tipo_transaccion: "egreso",
    moneda: "USD",
    medio_pago: "efectivo",
    estado: "confirmada",
    archivo: base64,
    archivo_nombre: archivo.name
  };
}
```

## Respuestas de Error

### Formato inválido
```json
{
  "success": false,
  "error": "Formato de archivo inválido. Debe ser base64."
}
```

### Tipo no permitido
```json
{
  "success": false,
  "error": "Tipo de archivo no permitido. Solo se permiten: JPG, PNG, PDF, TXT"
}
```

### Archivo muy grande
```json
{
  "success": false,
  "error": "El archivo es muy grande. Máximo 5MB permitido."
}
```

## Retrieving Files

Para obtener un archivo:

1. Hacer GET a `/api/transactions/{id}`
2. El campo `archivo_adjunto` contiene el base64
3. Concatenar con el tipo MIME para recrear el data URL:

```javascript
function recrearDataURL(transaccion) {
  if (transaccion.archivo_adjunto && transaccion.archivo_tipo) {
    return `data:${transaccion.archivo_tipo};base64,${transaccion.archivo_adjunto}`;
  }
  return null;
}

// Para mostrar en un elemento img
const dataURL = recrearDataURL(transaccion);
if (dataURL) {
  document.getElementById('imagen').src = dataURL;
}

// Para descargar
function descargarArchivo(transaccion) {
  const dataURL = recrearDataURL(transaccion);
  if (dataURL) {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = transaccion.archivo_nombre || 'archivo';
    link.click();
  }
}
```

## Consideraciones de Seguridad

1. **Validación de tipos MIME**: Solo se permiten tipos específicos
2. **Límite de tamaño**: 5MB máximo para evitar sobrecarga
3. **Validación de formato**: Se verifica que sea base64 válido
4. **Almacenamiento**: Los archivos se almacenan sin el prefijo data URL por eficiencia

## Base de Datos

Los archivos se almacenan directamente en MongoDB como parte del documento de transacción. Para archivos grandes o alto volumen, considerar:

1. **GridFS**: Para archivos > 16MB
2. **Almacenamiento externo**: AWS S3, Google Cloud Storage
3. **CDN**: Para mejor performance de descarga

## Ejemplos de Uso

### Subir una imagen
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion_transaccion": "Compra de suministros",
    "monto_transaccion": 75.50,
    "tipo_transaccion": "egreso",
    "moneda": "USD",
    "medio_pago": "tarjeta",
    "estado": "confirmada",
    "archivo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//...",
    "archivo_nombre": "recibo.jpg"
  }'
```

### Actualizar archivo existente
```bash
curl -X PUT http://localhost:5000/api/transactions/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "archivo": "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEK...",
    "archivo_nombre": "factura_actualizada.pdf"
  }'
```