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
     * Duración visible aproximada de la estela.
     * Después de este tiempo cada punto desaparece.
     */

    var duracionEstela =
        350;


    /*
     * Distancia mínima antes de guardar
     * un nuevo punto.
     */

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


        /*
         * Eliminamos inmediatamente
         * cualquier estela existente.
         */

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

       Si se abandona la ventana:
       - desaparece esfera
       - desaparece estela
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
        function () {

            ocultarTodo();

        }
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

       Esto hace que la estela desaparezca aunque
       el mouse quede completamente quieto.
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

       Una única cinta:
       - gruesa junto a la esfera
       - progresivamente más fina
       - sigue curvas reales
       - sin círculos ni manchas separadas
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


        /*
         * Si el cursor está grande por hover,
         * la estela también nace más ancha.
         */

        var diametroActual =
            cursor.classList.contains(
                "halley-cursor-hover"
            )
            ? 70
            : 30;


        /*
         * La estela nace un poco más ancha
         * que la propia esfera.
         */

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


            /*
             * La cola empieza prácticamente en cero
             * y crece suavemente hasta la esfera.
             */

            var ancho =
                anchoMaximo *
                Math.pow(
                    progreso,
                    1.55
                );


            /*
             * Tangente local.
             * Esto permite que el ancho siga
             * correctamente las curvas.
             */

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


            /*
             * Vector perpendicular.
             */

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
           CONSTRUIR UNA ÚNICA FORMA CERRADA
           ================================================= */

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


        /* =================================================
           APARIENCIA
           ================================================= */

        /*
         * Cuanto más vieja sea la cola,
         * más débil se vuelve toda la estela.
         */

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
                puntos.length -
                1
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
