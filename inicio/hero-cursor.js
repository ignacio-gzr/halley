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


    var duracionEstela =
        350;


    var distanciaMinima =
        2;


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

                    return (
                        ahora -
                        punto.t
                    ) <
                    duracionEstela;

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


        var diametroActual =
            cursor.classList.contains(
                "halley-cursor-hover"
            )
                ? 70
                : 30;


        var anchoMaximo =
            diametroActual +
            6;


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


            var ancho =
                anchoMaximo *
                Math.pow(
                    progreso,
                    1.55
                );


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


        ctx.beginPath();


        ctx.moveTo(
            ladosIzquierdos[0].x,
            ladosIzquierdos[0].y
        );


        for (
            var j = 1;
            j < ladosIzquierdos.length;
            j++
        ) {

            ctx.lineTo(
                ladosIzquierdos[j].x,
                ladosIzquierdos[j].y
            );

        }


        for (
            var k =
                ladosDerechos.length - 1;
            k >= 0;
            k--
        ) {

            ctx.lineTo(
                ladosDerechos[k].x,
                ladosDerechos[k].y
            );

        }


        ctx.closePath();


        var edadCabeza =
            ahora -
            puntos[
                puntos.length - 1
            ].t;


        var opacidadGeneral =
            Math.max(
                0,
                1 -
                edadCabeza /
                duracionEstela
            );


        ctx.globalAlpha =
            0.14 *
            opacidadGeneral;


        ctx.fillStyle =
            "#1C1F24";


        ctx.shadowColor =
            "rgba(28, 31, 36, 0.12)";


        ctx.shadowBlur =
            7;


        ctx.fill();


        ctx.globalAlpha =
            1;


        ctx.shadowBlur =
            0;

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
