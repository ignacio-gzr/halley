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
       4. CREAR CANVAS PARA LA ESTELA
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
       5. AJUSTAR CANVAS A LA PANTALLA
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
       6. POSICIONES
       ===================================================== */

    var mouseX = 0;
    var mouseY = 0;


    var cursorX = 0;
    var cursorY = 0;


    var iniciado = false;
    var activo = false;


    /* Historial de trayectoria */

    var puntos = [];


    var maxPuntos = 26;


    /* =====================================================
       7. DETECTAR POSICIÓN Y ZONA ACTIVA
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


                iniciado = true;

            }


            var elemento =
                document.elementFromPoint(
                    mouseX,
                    mouseY
                );


            var dentroZona =
                elemento &&
                (
                    elemento.closest(
                        "#HeaderD"
                    ) ||
                    elemento.closest(
                        ".tatsu-header"
                    )
                );


            if (dentroZona) {

                activo = true;


                cursor.classList.add(
                    "halley-cursor-visible"
                );


                canvas.classList.add(
                    "halley-cursor-visible"
                );

            } else {

                activo = false;


                cursor.classList.remove(
                    "halley-cursor-visible",
                    "halley-cursor-hover"
                );


                canvas.classList.remove(
                    "halley-cursor-visible"
                );

            }

        }
    );


    /* =====================================================
       8. HOVER SOBRE ELEMENTOS INTERACTIVOS
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
       9. DIBUJAR ESTELA CONTINUA
       ===================================================== */

    function dibujarEstela() {


        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );


        if (
            puntos.length <
            2
        ) {
            return;
        }


        /*
         * Dibujamos pequeños segmentos continuos.
         * Cada segmento es progresivamente:
         *
         * - más ancho cerca del cursor
         * - más transparente hacia la cola
         *
         * Visualmente forman UNA sola estela.
         */

        for (
            var i = 1;
            i < puntos.length;
            i++
        ) {

            var anterior =
                puntos[
                    i - 1
                ];


            var actual =
                puntos[
                    i
                ];


            var progreso =
                i /
                (
                    puntos.length -
                    1
                );


            /*
             * Curva suave:
             * usamos el punto medio entre ambos.
             */

            var medioX =
                (
                    anterior.x +
                    actual.x
                ) /
                2;


            var medioY =
                (
                    anterior.y +
                    actual.y
                ) /
                2;


            /*
             * Grosor:
             * casi desaparece al final de la cola
             * y se conecta con la esfera adelante.
             */

            var grosor =
                1 +
                progreso *
                13;


            /*
             * Opacidad:
             * aumenta progresivamente hacia el cursor.
             */

            var alpha =
                0.015 +
                progreso *
                0.12;


            ctx.beginPath();


            ctx.moveTo(
                anterior.x,
                anterior.y
            );


            ctx.quadraticCurveTo(
                anterior.x,
                anterior.y,
                medioX,
                medioY
            );


            ctx.lineTo(
                actual.x,
                actual.y
            );


            ctx.lineWidth =
                grosor;


            ctx.lineCap =
                "round";


            ctx.lineJoin =
                "round";


            ctx.strokeStyle =
                "rgba(28, 31, 36, " +
                alpha +
                ")";


            ctx.stroke();

        }

    }


    /* =====================================================
       10. ANIMACIÓN DE SEGUIMIENTO
       ===================================================== */

    function animarCursor() {


        /* Seguimiento suave del cursor */

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
           HISTORIAL DE LA TRAYECTORIA
           ================================================= */

        if (activo) {


            var ultimo =
                puntos[
                    puntos.length -
                    1
                ];


            var agregarPunto =
                !ultimo ||
                Math.hypot(
                    cursorX -
                    ultimo.x,
                    cursorY -
                    ultimo.y
                ) >
                1.5;


            if (agregarPunto) {

                puntos.push(
                    {
                        x:
                            cursorX,

                        y:
                            cursorY
                    }
                );

            }


            /*
             * Mantener una cola corta.
             */

            while (
                puntos.length >
                maxPuntos
            ) {

                puntos.shift();

            }

        } else {


            /*
             * Al salir del Hero,
             * la cola desaparece progresivamente.
             */

            if (
                puntos.length >
                0
            ) {

                puntos.shift();

            }

        }


        dibujarEstela();


        requestAnimationFrame(
            animarCursor
        );

    }


    animarCursor();


})();
