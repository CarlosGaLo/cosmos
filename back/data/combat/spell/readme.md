# Archivos JSON de Magia - Cosmos RPG

## Archivos generados

Se han convertido exitosamente 7 archivos CSV de magia al formato JSON:

1. **animancia.json** - 19 hechizos
2. **fisiomancia.json** - 18 hechizos
3. **kairomancia.json** - 19 hechizos
4. **arcanomancia.json** - 19 hechizos
5. **knutomancia.json** - 19 hechizos
6. **cronomancia.json** - 19 hechizos
7. **tanatomancia.json** - 22 hechizos

**Total: 135 hechizos**

## Estructura de cada hechizo

Cada hechizo en los archivos JSON tiene la siguiente estructura:

```json
{
  "name": "Nombre del hechizo",
  "lvl": 0,
  "xp": 0,
  "requisites": [],
  "description": "Descripción completa del hechizo",
  "resume": "",
  "group": ["nombre_de_magia"],
  "manaCost": 0,
  "threshold": 0,
  "challenge": null,
  "isAdquired": false
}
```

## Campos

- **name**: Nombre del hechizo
- **lvl**: Nivel del hechizo (0-5)
- **xp**: Puntos de experiencia necesarios para aprender
- **requisites**: Array de requisitos previos (vacío por defecto)
- **description**: Descripción completa del efecto del hechizo
- **resume**: Resumen corto (vacío por defecto, puede ser completado manualmente)
- **group**: Array con el tipo de magia al que pertenece
- **manaCost**: Coste en puntos de maná
- **threshold**: Dificultad del hechizo
- **challenge**: Desafío adicional (null por defecto)
- **isAdquired**: Indica si el personaje ha adquirido el hechizo (false por defecto)

## Integración en tu aplicación

Para integrar estos archivos en tu aplicación Cosmos:

1. Copia los archivos JSON a la carpeta `back/data/combat/spell/`
2. Si ya existe un archivo con el mismo nombre (como `arcano.json`), decide si:

   - Reemplazarlo completamente
   - Fusionar los contenidos
   - Mantener el existente y renombrar el nuevo

3. Verifica que el backend esté configurado para cargar estos archivos en los endpoints apropiados

## Notas

- El campo `resume` está vacío en todos los hechizos. Puedes completarlo manualmente si lo necesitas para mostrar información resumida en la UI
- El campo `challenge` se ha dejado como `null` siguiendo el patrón del archivo `arcano.json`
- El campo `requisites` es un array vacío que puede ser poblado con requisitos específicos si es necesario
- Todos los hechizos tienen `isAdquired: false` por defecto

## Próximos pasos sugeridos

1. Revisar manualmente las descripciones para asegurar que se han importado correctamente
2. Añadir resúmenes en el campo `resume` si lo consideras necesario
3. Configurar requisitos en el campo `requisites` para hechizos que lo necesiten
4. Ajustar el campo `challenge` si algunos hechizos lo requieren
5. Integrar los archivos en el sistema de endpoints del backend
