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
       2. LOCALIZAR ZONAS ACTIVAS
       ===================================================== */

    var hero =
        document.querySelector(
            "#HeaderD"
        );


    var header =
        document.querySelector(
            ".tatsu-header"
        );


    if (!hero && !header) {
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
    850;


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
       7. SABER SI EL MOUSE ESTÁ EN HERO / HEADER
       ===================================================== */

    function estaEnZonaActiva(
        x,
        y
    ) {

        var elemento =
            document.elementFromPoint(
                x,
                y
            );


        if (!elemento) {
            return false;
        }


        return !!(
            elemento.closest(
                "#HeaderD"
            ) ||
            elemento.closest(
                ".tatsu-header"
            )
        );

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
                estaEnZonaActiva(
                    mouseX,
                    mouseY
                );


            if (activo) {

                mostrarCursor();

            } else {

                ocultarTodo();

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

    document.addEventListener(
        "mousemove",
        function (evento) {

            if (!activo) {
                return;
            }


            var interactivo =
                evento.target.closest(
                    "a, " +
                    "button, " +
                    "[role='button'], " +
                    "input, " +
                    "select, " +
                    "textarea, " +
                    "[data-cursor-hover]"
                );


            if (interactivo) {

                cursor.classList.add(
                    "halley-cursor-hover"
                );

            } else {

                cursor.classList.remove(
                    "halley-cursor-hover"
                );

            }

        }
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
        cursor.classList.contains(
            "halley-cursor-hover"
        )
            ? 70
            : 30;


    /*
     * La nube nace un poco más ancha que
     * la esfera para que siempre quede
     * visualmente conectada con ella.
     */

    var anchoMaximo =
        diametroActual +
        10;


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
            variacionNube;


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
        "#1C1F24";


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
        "#1C1F24";


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
        "#1C1F24";


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
            0.34;


        cursorY +=
            (
                mouseY -
                cursorY
            ) *
            0.34;


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
