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
       4. CREAR ESTELA
       ===================================================== */

    var trail1 =
        document.createElement(
            "div"
        );


    trail1.className =
        "halley-hero-cursor-trail " +
        "halley-hero-cursor-trail-1";


    document.body.appendChild(
        trail1
    );


    var trail2 =
        document.createElement(
            "div"
        );


    trail2.className =
        "halley-hero-cursor-trail " +
        "halley-hero-cursor-trail-2";


    document.body.appendChild(
        trail2
    );


    /* =====================================================
       5. POSICIONES
       ===================================================== */

    var mouseX = 0;
    var mouseY = 0;


    var cursorX = 0;
    var cursorY = 0;


    var trail1X = 0;
    var trail1Y = 0;


    var trail2X = 0;
    var trail2Y = 0;


    var iniciado = false;


    /* =====================================================
       6. MOVIMIENTO DEL MOUSE
       ===================================================== */

    document.addEventListener(
        "mousemove",
        function (evento) {

            mouseX =
                evento.clientX;

            mouseY =
                evento.clientY;


            if (!iniciado) {

                cursorX = mouseX;
                cursorY = mouseY;

                trail1X = mouseX;
                trail1Y = mouseY;

                trail2X = mouseX;
                trail2Y = mouseY;

                iniciado = true;

            }

        }
    );


    /* =====================================================
   7. ANIMACIÓN DE SEGUIMIENTO
   ===================================================== */

function animarCursor() {


    /* Cursor principal */

    cursorX +=
        (
            mouseX -
            cursorX
        ) *
        0.32;


    cursorY +=
        (
            mouseY -
            cursorY
        ) *
        0.32;


    /* Primera estela */

    trail1X +=
        (
            cursorX -
            trail1X
        ) *
        0.20;


    trail1Y +=
        (
            cursorY -
            trail1Y
        ) *
        0.20;


    /* Segunda estela */

    trail2X +=
        (
            trail1X -
            trail2X
        ) *
        0.14;


    trail2Y +=
        (
            trail1Y -
            trail2Y
        ) *
        0.14;


    /* =================================================
       DIRECCIÓN Y VELOCIDAD
       ================================================= */

    var deltaX =
        mouseX -
        cursorX;


    var deltaY =
        mouseY -
        cursorY;


    var velocidad =
        Math.sqrt(
            deltaX * deltaX +
            deltaY * deltaY
        );


    var angulo =
        Math.atan2(
            deltaY,
            deltaX
        ) *
        180 /
        Math.PI;


    /* =================================================
       ESCALA DINÁMICA DE LA ESTELA
       ================================================= */

    var escalaTrail1 =
        1 +
        Math.min(
            velocidad / 80,
            0.45
        );


    var escalaTrail2 =
        1 +
        Math.min(
            velocidad / 65,
            0.65
        );


    /* =================================================
       CURSOR PRINCIPAL
       ================================================= */

    cursor.style.transform =
        "translate3d(" +
        cursorX +
        "px, " +
        cursorY +
        "px, 0) " +
        "translate(-50%, -50%)";


    /* =================================================
       ESTELA PRINCIPAL
       ================================================= */

    trail1.style.transform =
        "translate3d(" +
        trail1X +
        "px, " +
        trail1Y +
        "px, 0) " +
        "translate(-100%, -50%) " +
        "rotate(" +
        angulo +
        "deg) " +
        "scaleX(" +
        escalaTrail1 +
        ")";


    /* =================================================
       ESTELA SECUNDARIA
       ================================================= */

    trail2.style.transform =
        "translate3d(" +
        trail2X +
        "px, " +
        trail2Y +
        "px, 0) " +
        "translate(-100%, -50%) " +
        "rotate(" +
        angulo +
        "deg) " +
        "scaleX(" +
        escalaTrail2 +
        ")";


    requestAnimationFrame(
        animarCursor
    );

}


animarCursor();

    /* =====================================================
       8. MOSTRAR / OCULTAR CURSOR
       ===================================================== */

    function mostrarCursor() {

        cursor.classList.add(
            "halley-cursor-visible"
        );

        trail1.classList.add(
            "halley-cursor-visible"
        );

        trail2.classList.add(
            "halley-cursor-visible"
        );

    }


    function ocultarCursor() {

        cursor.classList.remove(
            "halley-cursor-visible",
            "halley-cursor-hover"
        );

        trail1.classList.remove(
            "halley-cursor-visible"
        );

        trail2.classList.remove(
            "halley-cursor-visible"
        );

    }


    if (hero) {

        hero.addEventListener(
            "mouseenter",
            mostrarCursor
        );


        hero.addEventListener(
            "mouseleave",
            ocultarCursor
        );

    }


    if (header) {

        header.addEventListener(
            "mouseenter",
            mostrarCursor
        );


        header.addEventListener(
            "mouseleave",
            ocultarCursor
        );

    }


    /* =====================================================
       9. HOVER SOBRE ELEMENTOS INTERACTIVOS
       HERO + HEADER
       ===================================================== */

    var selectoresHover =
        "a, button, " +
        "[role='button'], " +
        "input, select, textarea, " +
        "[data-cursor-hover]";


    function activarHover(evento) {

        if (
            evento.target.closest(
                selectoresHover
            )
        ) {

            cursor.classList.add(
                "halley-cursor-hover"
            );

        }

    }


    function desactivarHover(evento) {

        if (
            evento.target.closest(
                selectoresHover
            )
        ) {

            cursor.classList.remove(
                "halley-cursor-hover"
            );

        }

    }


    if (hero) {

        hero.addEventListener(
            "mouseover",
            activarHover
        );


        hero.addEventListener(
            "mouseout",
            desactivarHover
        );

    }


    if (header) {

        header.addEventListener(
            "mouseover",
            activarHover
        );


        header.addEventListener(
            "mouseout",
            desactivarHover
        );

    }

})();
