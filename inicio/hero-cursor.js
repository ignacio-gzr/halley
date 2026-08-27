/* =========================================================
   HALLEY — CURSOR PERSONALIZADO HERO + HEADER
   ========================================================= */

(function () {


    /* =====================================================
       1. SOLO DISPOSITIVOS CON MOUSE
       ===================================================== */

    if (
        !window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {
        return;
    }


    /* =====================================================
   2. LOCALIZAR LANDING
   ===================================================== */

var landing =
    document.body;


if (!landing) {
    return;
}
    /* =====================================================
       3. CREAR CURSOR
       ===================================================== */

    var cursor =
        document.createElement(
            "div"
        );


    cursor.className =
        "halley-hero-cursor";


    document.body.appendChild(
        cursor
    );


    /* =====================================================
       4. CREAR CANVAS DE ESTELA
       ===================================================== */

    var canvas =
        document.createElement(
            "canvas"
        );


    canvas.className =
        "halley-hero-cursor-canvas";


    document.body.appendChild(
        canvas
    );


    var ctx =
        canvas.getContext(
            "2d"
        );


    /* =====================================================
       5. AJUSTAR CANVAS
       ===================================================== */

    function ajustarCanvas() {

        var dpr =
            window.devicePixelRatio || 1;


        canvas.width =
            window.innerWidth *
            dpr;


        canvas.height =
            window.innerHeight *
            dpr;


        canvas.style.width =
            window.innerWidth +
            "px";


        canvas.style.height =
            window.innerHeight +
            "px";


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

    }


    ajustarCanvas();


    window.addEventListener(
        "resize",
        ajustarCanvas
    );


   /* =====================================================
   6. ESTADO Y POSICIONES
   ===================================================== */

var mouseX = 0;
var mouseY = 0;


var cursorX = 0;
var cursorY = 0;


var iniciado = false;
var activo = false;


var puntos = [];


/*
 * Tiempo máximo que puede permanecer una parte
 * de la estela cerca del cursor.
 *
 * Más largo que antes para darle una sensación
 * más suave y persistente.
 */

var duracionEstela =
    500;


/*
 * Longitud máxima de la estela.
 *
 * Aproximadamente equivalente visual a 7 cm.
 * Si un punto se aleja más, desaparece
 * independientemente de su antigüedad.
 */

var distanciaMaximaEstela =
    265;


/*
 * Distancia mínima necesaria para guardar
 * un nuevo punto de trayectoria.
 */

var distanciaMinima =
    2.5;


/* =====================================================
   7. DETECTAR CONTEXTO DEL FONDO
   ===================================================== */

function obtenerRGBA(
    color
) {

    var valores =
        String(
            color || ""
        ).match(
            /[\d.]+/g
        );


    if (
        !valores ||
        valores.length <
        3
    ) {
        return null;
    }


    return {

        r:
            Number(
                valores[0]
            ),

        g:
            Number(
                valores[1]
            ),

        b:
            Number(
                valores[2]
            ),

        a:
            valores.length >= 4
                ?
                    Number(
                        valores[3]
                    )
                :
                    1

    };

}


/* =====================================================
   LUMINANCIA
   ===================================================== */

function obtenerLuminancia(
    color
) {

    if (!color) {
        return 255;
    }


    return (
        0.299 * color.r +
        0.587 * color.g +
        0.114 * color.b
    );

}


/* =====================================================
   DETECTAR TURQUESA HALLEY
   ===================================================== */

function colorEsTurquesa(
    color
) {

    if (!color) {
        return false;
    }


    var diferencia =
        Math.sqrt(

            Math.pow(
                color.r - 71,
                2
            ) +

            Math.pow(
                color.g - 157,
                2
            ) +

            Math.pow(
                color.b - 165,
                2
            )

        );


    return (
        diferencia <
        65
    );

}


function analizarSeccionVisual(
    seccion
) {

    if (!seccion) {
        return null;
    }


    /* =================================================
       OVERRIDES MANUALES
       ================================================= */

    if (
        seccion.classList.contains(
            "halley-cursor-bg-dark"
        )
    ) {

        return {
            oscuro: true,
            turquesa: false
        };

    }


    if (
        seccion.classList.contains(
            "halley-cursor-bg-turquoise"
        )
    ) {

        return {
            oscuro: false,
            turquesa: true
        };

    }


    /* =================================================
       COLOR SÓLIDO DE LA SECCIÓN
       ================================================= */

    var estiloSeccion =
        window.getComputedStyle(
            seccion
        );


    var fondoSeccion =
        obtenerRGBA(
            estiloSeccion.backgroundColor
        );


    if (
        fondoSeccion &&
        fondoSeccion.a >= 0.80
    ) {

        if (
            colorEsTurquesa(
                fondoSeccion
            )
        ) {

            return {
                oscuro: false,
                turquesa: true
            };

        }

    }


    /* =================================================
       SECCIÓN PARALLAX / VISUAL
       ================================================= */

    var esParallax =
        seccion.classList.contains(
            "tatsu-parallax"
        ) ||
        seccion.classList.contains(
            "tatsu-parallaxed"
        );


    if (
        esParallax
    ) {

        var candidatos =
            seccion.querySelectorAll(
                "h1, h2, h3, h4, h5, h6, p, span, a"
            );


        var claros = 0;
        var oscuros = 0;


        var limite =
            Math.min(
                candidatos.length,
                80
            );


        for (
            var i = 0;
            i < limite;
            i++
        ) {

            var elemento =
                candidatos[i];


            var rect =
                elemento.getBoundingClientRect();


            if (
                rect.width <= 0 ||
                rect.height <= 0
            ) {
                continue;
            }


            var estilo =
                window.getComputedStyle(
                    elemento
                );


            if (
                estilo.visibility === "hidden" ||
                Number(estilo.opacity) < 0.2
            ) {
                continue;
            }


            var colorTexto =
                obtenerRGBA(
                    estilo.color
                );


            if (!colorTexto) {
                continue;
            }


            var luminancia =
                obtenerLuminancia(
                    colorTexto
                );


            if (
                luminancia > 180
            ) {

                claros++;

            } else if (
                luminancia < 120
            ) {

                oscuros++;

            }

        }


        /* Texto claro predominante → fondo oscuro */

        if (
            claros > oscuros
        ) {

            return {
                oscuro: true,
                turquesa: false
            };

        }


        /* Texto oscuro predominante → fondo claro */

        if (
            oscuros > claros
        ) {

            return {
                oscuro: false,
                turquesa: false
            };

        }


        /*
         * Fallback:
         * si es parallax y no pudimos decidir,
         * lo tratamos como fondo oscuro.
         */

        return {
            oscuro: true,
            turquesa: false
        };

    }


    return null;

}


/* =====================================================
   ANALIZAR FONDO REAL
   ===================================================== */

function analizarFondo(
    elemento
) {

    if (!elemento) {

        return {
            oscuro: false,
            turquesa: false
        };

    }


    /* =================================================
       1. ANALIZAR SECCIÓN COMPLETA
       ================================================= */

var seccion =
    elemento.closest(
        ".tatsu-section, " +
        ".tatsu-section-offset, " +
        ".tatsu-parallax, " +
        "section"
    );


    var contextoSeccion =
        analizarSeccionVisual(
            seccion
        );


    if (
        contextoSeccion
    ) {

        return contextoSeccion;

    }


    /* =================================================
       2. ANALIZAR ELEMENTO Y ANCESTROS
       ================================================= */

    var actual =
        elemento;


    while (
        actual &&
        actual !==
        document.documentElement
    ) {

        if (
            actual.classList &&
            actual.classList.contains(
                "halley-cursor-bg-dark"
            )
        ) {

            return {
                oscuro: true,
                turquesa: false
            };

        }


        if (
            actual.classList &&
            actual.classList.contains(
                "halley-cursor-bg-turquoise"
            )
        ) {

            return {
                oscuro: false,
                turquesa: true
            };

        }


        var estilo =
            window.getComputedStyle(
                actual
            );


        var fondo =
            obtenerRGBA(
                estilo.backgroundColor
            );


        if (
            fondo &&
            fondo.a >=
            0.80
        ) {

            return {

                oscuro:
                    obtenerLuminancia(
                        fondo
                    ) <
                    145,

                turquesa:
                    colorEsTurquesa(
                        fondo
                    )

            };

        }


        actual =
            actual.parentElement;

    }


    return {
        oscuro: false,
        turquesa: false
    };

}
   
    /* =====================================================
       8. MOSTRAR / OCULTAR
       ===================================================== */

    function mostrarCursor() {

        cursor.classList.add(
            "halley-cursor-visible"
        );


        canvas.classList.add(
            "halley-cursor-visible"
        );

    }


    function ocultarTodo() {

        activo = false;


        cursor.classList.remove(
            "halley-cursor-visible",
            "halley-cursor-hover"
        );


        canvas.classList.remove(
            "halley-cursor-visible"
        );


        puntos = [];


        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );

    }


/* =====================================================
   9. MOVIMIENTO DEL MOUSE
   ===================================================== */

document.addEventListener(
    "mousemove",
    function (evento) {

        mouseX =
            evento.clientX;


        mouseY =
            evento.clientY;


        if (!iniciado) {

            cursorX =
                mouseX;


            cursorY =
                mouseY;


            iniciado =
                true;

        }


        activo =
            true;


        mostrarCursor();


        /* =================================================
           ANALIZAR FONDO DEBAJO DEL CURSOR
           ================================================= */

        var elementoDebajo =
            document.elementFromPoint(
                mouseX,
                mouseY
            );


        var contexto =
            analizarFondo(
                elementoDebajo
            );


        /* =================================================
           ESFERA PEQUEÑA
           Blanco sobre oscuro
           Negro sobre claro
           ================================================= */

        if (
            contexto.oscuro
        ) {

            cursor.classList.add(
                "halley-cursor-light"
            );

        } else {

            cursor.classList.remove(
                "halley-cursor-light"
            );

        }


        /* =================================================
           HOVER SOBRE TURQUESA
           ================================================= */

        if (
            contexto.turquesa
        ) {

            cursor.classList.add(
                "halley-cursor-accent-bg"
            );

        } else {

            cursor.classList.remove(
                "halley-cursor-accent-bg"
            );

        }

    }
);
    /* =====================================================
       10. MOUSE FUERA DEL NAVEGADOR
       ===================================================== */

    window.addEventListener(
        "mouseout",
        function (evento) {

            if (
                !evento.relatedTarget &&
                !evento.toElement
            ) {

                ocultarTodo();

            }

        }
    );


    window.addEventListener(
        "blur",
        ocultarTodo
    );


/* =====================================================
   11. HOVER SOBRE ELEMENTOS INTERACTIVOS
   ===================================================== */

function elementoEsInteractivo(
    elemento
) {

    if (!elemento) {
        return false;
    }


    return !!elemento.closest(

        /* =================================================
           ELEMENTOS HTML NORMALES
           ================================================= */

        "a, " +
        "button, " +
        "input, " +
        "select, " +
        "textarea, " +
        "summary, " +
        "[role='button'], " +
        "[onclick], " +
        "[data-cursor-hover], " +


        /* =================================================
           ACCORDION / TOGGLE
           Sólo encabezado clickeable
           ================================================= */

        "[aria-expanded], " +
        "[aria-controls], " +

        "[class*='accordion-title'], " +
        "[class*='accordion-header'], " +
        "[class*='accordion-heading'], " +
        "[class*='accordion-question'], " +

        "[class*='toggle-title'], " +
        "[class*='toggle-header'], " +
        "[class*='toggle-heading'], " +


        /* =================================================
           FLICKITY
           Slider de testimonios
           ================================================= */

        ".flickity-page-dots .dot, " +
        ".flickity-page-dots li, " +
        ".flickity-button, " +
        ".flickity-prev-next-button, " +


        /* =================================================
           OTROS SLIDERS
           ================================================= */

        ".slick-dots li, " +
        ".slick-dots button, " +

        ".swiper-pagination-bullet, " +

        "[role='tab'], " +
        "[data-slide], " +
        "[data-slide-index], " +

        "[class*='pagination-bullet'], " +
        "[class*='pagination-dot'], " +
        "[class*='carousel-dot'], " +
        "[class*='carousel-indicator'], " +
        "[class*='slider-dot'], " +
        "[class*='slider-indicator']"

    );

}


document.addEventListener(
    "mousemove",
    function (evento) {

        if (!activo) {
            return;
        }


        var elemento =
            document.elementFromPoint(
                evento.clientX,
                evento.clientY
            ) ||
            evento.target;


        var interactivo =
            elementoEsInteractivo(
                elemento
            );


        if (
            interactivo
        ) {

            cursor.classList.add(
                "halley-cursor-hover",
                "halley-cursor-visible"
            );


            canvas.classList.add(
                "halley-cursor-visible"
            );

        } else {

            cursor.classList.remove(
                "halley-cursor-hover"
            );

        }

    },
    true
);
   
    /* =====================================================
   12. LIMPIAR PUNTOS VIEJOS
   ===================================================== */

function limpiarPuntosViejos(
    ahora
) {

    puntos =
        puntos.filter(
            function (punto) {


                /* =========================================
                   EDAD DEL PUNTO
                   ========================================= */

                var edad =
                    ahora -
                    punto.t;


                /* =========================================
                   DISTANCIA AL METEORITO
                   ========================================= */

                var distancia =
                    Math.hypot(
                        cursorX -
                        punto.x,
                        cursorY -
                        punto.y
                    );


                /*
                 * El punto permanece solamente mientras:
                 *
                 * 1. no haya superado su tiempo máximo
                 * 2. siga dentro de la longitud máxima
                 *    permitida de la estela
                 */

                return (
                    edad <
                    duracionEstela
                ) &&
                (
                    distancia <
                    distanciaMaximaEstela
                );

            }
        );

}

/* =====================================================
   13. DIBUJAR ESTELA CONTINUA
   ===================================================== */

function dibujarEstela(
    ahora
) {

    /* =================================================
       SIN ESTELA DURANTE HOVER
       La esfera turquesa grande no deja rastro.
       ================================================= */

    if (
        cursor.classList.contains(
            "halley-cursor-hover"
        )
    ) {

        puntos = [];


        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );


        return;

    }
   
    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );


    limpiarPuntosViejos(
        ahora
    );


    if (
        puntos.length <
        2
    ) {
        return;
    }


    var ladosIzquierdos = [];
    var ladosDerechos = [];


    /* =================================================
       ANCHO EN LA CABEZA DE LA ESTELA
       ================================================= */

    var diametroActual =
    30;


    /*
     * La nube nace un poco más ancha que
     * la esfera para que siempre quede
     * visualmente conectada con ella.
     */

var anchoMaximo =
    diametroActual *
    1.20;


    /* =================================================
       CONSTRUIR CONTORNO
       ================================================= */

    for (
        var i = 0;
        i < puntos.length;
        i++
    ) {

        var punto =
            puntos[i];


        var progreso =
            i /
            (
                puntos.length -
                1
            );

       /* =================================================
   DESVANECIMIENTO SEGÚN DISTANCIA
   ================================================= */

var distanciaAlCursor =
    Math.hypot(
        cursorX -
        punto.x,
        cursorY -
        punto.y
    );


var factorDistancia =
    Math.max(
        0,
        1 -
        distanciaAlCursor /
        distanciaMaximaEstela
    );


        /*
         * La estela se afina hacia atrás.
         *
         * Agregamos una variación orgánica muy leve
         * para evitar una silueta geométricamente
         * perfecta.
         */

        var variacionNube =
            1 +
            Math.sin(
                i * 1.7 +
                ahora * 0.003
            ) *
            0.045;


var ancho =
    anchoMaximo *
    Math.pow(
        progreso,
        1.45
    ) *
    variacionNube *
    factorDistancia;


        /* =================================================
           DIRECCIÓN LOCAL DE LA CURVA
           ================================================= */

        var anterior =
            puntos[
                Math.max(
                    0,
                    i - 1
                )
            ];


        var siguiente =
            puntos[
                Math.min(
                    puntos.length - 1,
                    i + 1
                )
            ];


        var dx =
            siguiente.x -
            anterior.x;


        var dy =
            siguiente.y -
            anterior.y;


        var longitud =
            Math.sqrt(
                dx * dx +
                dy * dy
            ) || 1;


        var normalX =
            -dy /
            longitud;


        var normalY =
            dx /
            longitud;


        var mitad =
            ancho /
            2;


        ladosIzquierdos.push(
            {
                x:
                    punto.x +
                    normalX *
                    mitad,

                y:
                    punto.y +
                    normalY *
                    mitad
            }
        );


        ladosDerechos.push(
            {
                x:
                    punto.x -
                    normalX *
                    mitad,

                y:
                    punto.y -
                    normalY *
                    mitad
            }
        );

    }


    /* =================================================
       CREAR FORMA SUAVE
       ================================================= */

    function construirForma() {

        ctx.beginPath();


        ctx.moveTo(
            ladosIzquierdos[0].x,
            ladosIzquierdos[0].y
        );


        /*
         * Usamos curvas en lugar de unir todos
         * los puntos mediante líneas rectas.
         */

        for (
            var j = 1;
            j < ladosIzquierdos.length - 1;
            j++
        ) {

            var siguienteIzq =
                ladosIzquierdos[
                    j + 1
                ];


            var medioIzqX =
                (
                    ladosIzquierdos[j].x +
                    siguienteIzq.x
                ) /
                2;


            var medioIzqY =
                (
                    ladosIzquierdos[j].y +
                    siguienteIzq.y
                ) /
                2;


            ctx.quadraticCurveTo(
                ladosIzquierdos[j].x,
                ladosIzquierdos[j].y,
                medioIzqX,
                medioIzqY
            );

        }


        var ultimoIzq =
            ladosIzquierdos[
                ladosIzquierdos.length -
                1
            ];


        ctx.lineTo(
            ultimoIzq.x,
            ultimoIzq.y
        );


        for (
            var k =
                ladosDerechos.length - 1;
            k > 0;
            k--
        ) {

            var siguienteDer =
                ladosDerechos[
                    k - 1
                ];


            var medioDerX =
                (
                    ladosDerechos[k].x +
                    siguienteDer.x
                ) /
                2;


            var medioDerY =
                (
                    ladosDerechos[k].y +
                    siguienteDer.y
                ) /
                2;


            ctx.quadraticCurveTo(
                ladosDerechos[k].x,
                ladosDerechos[k].y,
                medioDerX,
                medioDerY
            );

        }


        ctx.lineTo(
            ladosDerechos[0].x,
            ladosDerechos[0].y
        );


        ctx.closePath();

    }


    /* =================================================
       DESVANECIMIENTO TEMPORAL
       ================================================= */

    var edadCabeza =
        ahora -
        puntos[
            puntos.length -
            1
        ].t;


    var opacidadTemporal =
        Math.max(
            0,
            1 -
            edadCabeza /
            duracionEstela
        );


    /* =================================================
       CAPA EXTERIOR — NUBE DIFUSA
       ================================================= */

    ctx.save();


    construirForma();


    ctx.globalAlpha =
        0.035 *
        opacidadTemporal;


ctx.fillStyle =
    cursor.classList.contains(
        "halley-cursor-light"
    )
        ? "#FFFFFF"
        : "#1C1F24";


    ctx.filter =
        "blur(14px)";


    ctx.fill();


    ctx.restore();


    /* =================================================
       CAPA MEDIA — CUERPO DE LA NUBE
       ================================================= */

    ctx.save();


    construirForma();


    ctx.globalAlpha =
        0.045 *
        opacidadTemporal;


ctx.fillStyle =
    cursor.classList.contains(
        "halley-cursor-light"
    )
        ? "#FFFFFF"
        : "#1C1F24";


    ctx.filter =
        "blur(7px)";


    ctx.fill();


    ctx.restore();


    /* =================================================
       CAPA INTERIOR — DENSIDAD SUTIL
       ================================================= */

    ctx.save();


    construirForma();


    ctx.globalAlpha =
        0.025 *
        opacidadTemporal;


ctx.fillStyle =
    cursor.classList.contains(
        "halley-cursor-light"
    )
        ? "#FFFFFF"
        : "#1C1F24";


    ctx.filter =
        "blur(3px)";


    ctx.fill();


    ctx.restore();


    /* =================================================
       RESTABLECER CANVAS
       ================================================= */

    ctx.globalAlpha =
        1;


    ctx.filter =
        "none";

}
    /* =====================================================
       14. ANIMACIÓN DEL CURSOR
       ===================================================== */

    function animarCursor(
        ahora
    ) {


        /* =================================================
           MOVIMIENTO SUAVE DE LA ESFERA
           ================================================= */

        cursorX +=
            (
                mouseX -
                cursorX
            ) *
            0.289;


        cursorY +=
            (
                mouseY -
                cursorY
            ) *
            0.289;


        cursor.style.transform =
            "translate3d(" +
            cursorX +
            "px, " +
            cursorY +
            "px, 0) " +
            "translate(-50%, -50%)";


        /* =================================================
           GUARDAR TRAYECTORIA
           ================================================= */

        if (activo) {

            var ultimo =
                puntos[
                    puntos.length - 1
                ];


            var distancia =
                ultimo
                    ?
                        Math.hypot(
                            cursorX -
                            ultimo.x,
                            cursorY -
                            ultimo.y
                        )
                    :
                        Infinity;


            if (
                distancia >
                distanciaMinima
            ) {

                puntos.push(
                    {
                        x:
                            cursorX,

                        y:
                            cursorY,

                        t:
                            ahora
                    }
                );

            }

        }


        /* =================================================
           DIBUJAR ESTELA
           ================================================= */

        dibujarEstela(
            ahora
        );


        /* =================================================
           SIGUIENTE FRAME
           ================================================= */

        requestAnimationFrame(
            animarCursor
        );

    }


    /* =====================================================
       INICIAR ANIMACIÓN
       ===================================================== */

    requestAnimationFrame(
        animarCursor
    );


})();
