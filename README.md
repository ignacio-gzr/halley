# Halley – Código Web

Repositorio utilizado para almacenar y mantener el código JavaScript y CSS personalizado de las distintas webs de Halley desarrolladas en Swipe Pages.

## Estructura

### Landing de Precios

Carpeta: `/precios`

- `precios.css` → CSS personalizado de la landing de precios.
- `precios.js` → JavaScript personalizado de la landing de precios.

## Forma de trabajo

GitHub funciona como fuente principal y respaldo del código.

Para realizar una modificación:

1. Partir siempre de la última versión estable almacenada en GitHub.
2. Modificar únicamente el código necesario.
3. Guardar el cambio mediante un commit con una descripción clara.
4. Copiar el código actualizado a Swipe Pages.
5. Probar la web antes de dar el cambio por terminado.
6. Publicar en Swipe Pages solamente cuando el funcionamiento sea correcto.

## Regla importante

No reemplazar una versión estable sin dejar previamente registrado el cambio mediante un commit.

Si una modificación genera errores, utilizar el historial de GitHub para identificar o recuperar la última versión estable.

## Commits

Usar descripciones claras que indiquen qué se modificó.

Ejemplos:

- `Mejora posicionamiento de tooltips`
- `Corrección loader de precios`
- `Ajuste estilos mobile`
- `Actualización carga de precios desde Google Sheets`

Evitar mensajes genéricos como:

- `cambios`
- `prueba`
- `actualización`
- `fix`

## Publicación

El código almacenado en GitHub no modifica automáticamente la web publicada.

Los cambios deben copiarse manualmente al apartado correspondiente de Custom CSS o Custom JavaScript de Swipe Pages y posteriormente publicarse.
