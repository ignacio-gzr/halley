# Halley – Código Web

Repositorio utilizado para almacenar y mantener el código JavaScript y CSS personalizado de las distintas webs de Halley desarrolladas en Swipe Pages.

GitHub funciona como fuente principal del código personalizado. Las landings cargan los archivos publicados en este repositorio mediante enlaces externos configurados en Swipe Pages.

---

## Estructura

### Código compartido

Carpeta: `/shared`

Contiene código utilizado por múltiples landings de Halley.

- `header-base.css` → estilos y comportamiento visual común del header.
- `header-light.css` → apariencia del header para landings con versión clara.
- `header-dark.css` → apariencia del header para landings con versión oscura.
- `header.js` → comportamiento JavaScript compartido del header.
- `footer.css` → estilos compartidos del footer.
- `footer.js` → comportamiento JavaScript compartido del footer, incluyendo el año automático del copyright.

Los archivos de `/shared` son comunes a varias landings.

Una modificación realizada sobre estos archivos puede afectar simultáneamente a todas las landings que los estén utilizando.

---

### Landing de Precios

Carpeta: `/precios`

Contiene únicamente código específico de la landing de precios.

- `precios.css` → CSS personalizado de la landing de precios.
- `precios.js` → JavaScript personalizado de la landing de precios.

---

## Organización del código

El código debe separarse según su alcance:

### Código compartido

Todo comportamiento o estilo que deba mantenerse igual entre varias landings debe almacenarse en `/shared`.

Ejemplos:

- Header fijo.
- Comportamiento del header al hacer scroll.
- Menú mobile.
- Apariencia clara u oscura del header.
- Footer.
- Año automático del copyright.

### Código específico

Todo comportamiento o estilo exclusivo de una landing debe almacenarse dentro de la carpeta correspondiente a esa landing.

Ejemplo:

`/precios/precios.css`

No agregar código específico de una landing dentro de `/shared`.

---

## Forma de trabajo

GitHub es la fuente principal del código.

Para realizar una modificación:

1. Identificar si el cambio corresponde a código compartido o específico de una landing.
2. Partir siempre de la última versión estable almacenada en GitHub.
3. Modificar únicamente el archivo correspondiente.
4. Guardar el cambio mediante un commit con una descripción clara.
5. Probar la web publicada y verificar que el funcionamiento sea correcto.
6. Si se modificó un archivo de `/shared`, comprobar también que el cambio no haya afectado incorrectamente a otras landings que utilicen ese archivo.

No es necesario copiar manualmente el contenido de estos archivos dentro de Custom CSS o Custom JavaScript de Swipe Pages cuando la landing ya está configurada para cargarlos externamente desde GitHub.

---

## Regla importante

No reemplazar una versión estable sin dejar previamente registrado el cambio mediante un commit.

Si una modificación genera errores, utilizar el historial de GitHub para identificar o recuperar la última versión estable.

Tener especial cuidado con los archivos de `/shared`, ya que una modificación puede propagarse a múltiples landings.

---

## Commits

Usar descripciones claras que indiquen qué se modificó.

Ejemplos:

- `Mejora posicionamiento de tooltips`
- `Corrección loader de precios`
- `Ajuste estilos mobile`
- `Actualización header claro`
- `Corrección comportamiento header al hacer scroll`
- `Ajuste estilos compartidos del footer`

Evitar mensajes genéricos como:

- `cambios`
- `prueba`
- `actualización`
- `fix`

---

## Publicación

Las landings configuradas con archivos externos cargan el código directamente desde GitHub.

Por lo tanto, una modificación realizada sobre un archivo utilizado por una landing puede reflejarse en la web sin necesidad de copiar nuevamente el código dentro de Swipe Pages.

### Importante

Los archivos de `/shared` pueden ser utilizados simultáneamente por varias landings.

Antes de modificar uno de estos archivos, considerar el impacto que tendrá el cambio sobre todas las webs que lo estén cargando.

Swipe Pages conserva únicamente los llamados necesarios para cargar los archivos externos y cualquier código que, por una razón específica, deba permanecer dentro de la plataforma.
