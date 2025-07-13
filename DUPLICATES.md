# Gestión de Contactos Duplicados - ContactosDiarios

## 🔍 Nueva Funcionalidad Implementada

Se ha añadido un sistema completo para **detectar y eliminar contactos duplicados** basado en email, teléfono o nombre completo.

## ✨ Características Principales

### 1. **Detección Inteligente de Duplicados**
- **Por Email**: Contactos con el mismo correo electrónico
- **Por Teléfono**: Números de teléfono normalizados (ignora espacios, guiones, paréntesis)
- **Por Nombre Completo**: Combinación exacta de nombre + apellidos

### 2. **Interfaz de Usuario Intuitiva**
- **Botón "🔍 Buscar duplicados"** en la interfaz principal
- **Modal organizado** que muestra grupos de duplicados
- **Información detallada** de cada contacto (teléfono, email, etiquetas, notas)
- **Selección por radio buttons** para elegir qué contacto mantener

### 3. **Gestión Segura**
- **Vista previa** antes de eliminar
- **Confirmación obligatoria** para evitar eliminaciones accidentales
- **Respaldo automático** con el sistema de backup existente

## 🚀 Cómo Usar la Funcionalidad

### Paso 1: Ejecutar Búsqueda
1. Haz clic en el botón **"🔍 Buscar duplicados"**
2. El sistema escaneará automáticamente todos los contactos
3. Si encuentra duplicados, se abrirá el modal de gestión

### Paso 2: Revisar Duplicados
Para cada grupo de duplicados verás:
- **Razón del duplicado** (email, teléfono, o nombre completo)
- **Información completa** de cada contacto
- **Número de notas** asociadas a cada uno

### Paso 3: Seleccionar Contacto a Mantener
- Por defecto, se selecciona el **primer contacto** de cada grupo
- Puedes **cambiar la selección** usando los radio buttons
- El contacto seleccionado será el que **se mantenga**

### Paso 4: Aplicar Cambios
1. Haz clic en **"✅ Eliminar Duplicados"**
2. Confirma la acción en el diálogo
3. Los contactos duplicados se eliminarán permanentemente

## 📊 Algoritmo de Detección

### Criterios de Duplicado:
```javascript
// Email idéntico (case-insensitive)
email1.toLowerCase() === email2.toLowerCase()

// Teléfono normalizado idéntico
normalizePhone(phone1) === normalizePhone(phone2)

// Nombre completo idéntico (case-insensitive)
name1.toLowerCase() === name2.toLowerCase() && 
surname1.toLowerCase() === surname2.toLowerCase()
```

### Normalización de Teléfono:
- Elimina espacios, guiones y paréntesis
- `"+34 600 123 456"` → `"+34600123456"`
- `"600-123-456"` → `"600123456"`

## ⚡ Casos de Uso Cubiertos

### ✅ **Detecta estos duplicados:**
- Juan Pérez (email: juan@email.com) y Juan Pérez (email: juan@email.com)
- María García (tel: 600 123 456) y María García (tel: 600-123-456)
- Antonio López y Antonio López (nombres idénticos)

### ❌ **NO detecta como duplicados:**
- Juan Pérez y Juan Pérez García (apellidos diferentes)
- juan@email.com y juan@othermail.com (emails diferentes)
- Contactos sin email ni teléfono

## 🛡️ Medidas de Seguridad

### 1. **Confirmación Múltiple**
- ⚠️ Notificación al encontrar duplicados
- 🔍 Vista detallada antes de eliminar
- ❓ Confirmación final obligatoria

### 2. **Información Contextual**
```
¿Estás seguro de eliminar 3 contacto(s) duplicado(s)?

Esta acción no se puede deshacer.
```

### 3. **Preservación de Datos**
- El contacto seleccionado mantiene **TODA** su información
- Solo se eliminan los contactos **no seleccionados**
- El sistema de backup automático sigue funcionando

## 🎯 Casos de Uso Reales

### Escenario 1: Importación de Contactos
```
Antes: 50 contactos + 25 contactos importados = 75 total (algunos duplicados)
Después: Buscar duplicados → 5 grupos encontrados → Eliminar → 70 contactos únicos
```

### Escenario 2: Entrada Manual Duplicada
```
Usuario añade accidentalmente:
- Juan Pérez (tel: 600123456)
- Juan Pérez (tel: 600 123 456)

Sistema detecta: ✅ Duplicado por teléfono normalizado
Resultado: Se mantiene uno, se elimina el otro
```

### Escenario 3: Emails Duplicados
```
Contactos con el mismo email pero nombres diferentes:
- "Juan" (juan.perez@company.com)
- "Juan Pérez" (juan.perez@company.com)

Sistema detecta: ✅ Duplicado por email
Usuario decide: Mantener el nombre más completo
```

## 📱 Diseño Responsivo

### Desktop
- Modal centrado con scroll vertical
- Vista en rejilla para comparar contactos
- Botones grandes y claros

### Mobile
- Modal adaptado al viewport
- Stack vertical de contactos
- Controles tactiles optimizados

## 🔧 Funciones Técnicas Implementadas

### Principales:
- `findAllDuplicates(contacts)` - Escanea y agrupa duplicados
- `isDuplicateContact(contact1, contact2)` - Compara dos contactos
- `normalizePhone(phone)` - Normaliza formato telefónico
- `applyDuplicateResolution()` - Aplica las eliminaciones

### Auxiliares:
- `getDuplicateReason()` - Identifica el criterio de duplicado
- `DuplicateManagementModal()` - Renderiza la interfaz

## 📈 Beneficios Inmediatos

1. **Base de datos más limpia** sin contactos redundantes
2. **Búsquedas más eficientes** con menos resultados duplicados
3. **Mejor organización** de la información de contacto
4. **Prevención de confusión** al gestionar contactos similares

## 🔮 Mejoras Futuras Sugeridas

1. **Fusión automática** en lugar de solo eliminación
2. **Resolución inteligente** basada en completitud de datos
3. **Previsualización de fusión** antes de aplicar
4. **Historial de eliminaciones** para deshacer acciones
5. **Configuración de criterios** personalizables por usuario

---

*Funcionalidad implementada el 13 de julio de 2025*  
*Compatible con la versión 0.0.48+*
