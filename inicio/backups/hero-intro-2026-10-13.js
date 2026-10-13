/* =========================================================
   HALLEY — HERO INTRO CONTROLADA
   ========================================================= */


/*
   PRE-INTRO:
   durante 650 ms queda visible solamente el logo.
*/

document.documentElement.classList.add(
    "halley-preintro"
);

(function () {

    function iniciarHeroHalley() {

        var hero =
            document.querySelector("#HeaderD");


        if (!hero) {

            document.documentElement
                .classList
                .remove(
                    "halley-preintro"
                );

            return;
        }


        /* =================================================
           LOCALIZAR TÍTULO PRINCIPAL

           Compatible con:
           H1
           H2
           H3
           ================================================= */

        var titulo =
            hero.querySelector(
                ".tatsu-title-wrap h1, " +
                ".tatsu-title-wrap h2, " +
                ".tatsu-title-wrap h3"
            ) ||
            hero.querySelector(
                "h1, h2, h3"
            );


        if (!titulo) {

            document.documentElement
                .classList
                .remove(
                    "halley-preintro"
                );

            return;
        }


        /* =================================================
           EVITAR DOBLE EJECUCIÓN
        ================================================= */

        if (
            document.documentElement
                .classList
                .contains(
                    "halley-hero-intro-ejecutada"
                )
        ) {

            document.documentElement
                .classList
                .remove(
                    "halley-preintro"
                );

            return;
        }


        document.documentElement
            .classList
            .add(
                "halley-hero-intro-ejecutada"
            );


        /* =================================================
           ELIMINAR ANIMACIONES NATIVAS DE SWIPE PAGES
        ================================================= */

        hero
            .querySelectorAll(
                "[data-animation], " +
                ".fadeInLeft, " +
                ".fadeInRight, " +
                ".fadeInUp, " +
                ".fadeInDown, " +
                ".already-visible, " +
                ".end-animation"
            )
            .forEach(
                function (elemento) {

                    elemento.removeAttribute(
                        "data-animation"
                    );

                    elemento.removeAttribute(
                        "data-animation-delay"
                    );

                    elemento.removeAttribute(
                        "data-animation-duration"
                    );

                    elemento.classList.remove(
                        "fadeInLeft",
                        "fadeInRight",
                        "fadeInUp",
                        "fadeInDown",
                        "already-visible",
                        "end-animation"
                    );

                    elemento.style.removeProperty(
                        "animation"
                    );

                    elemento.style.removeProperty(
                        "animation-name"
                    );

                    elemento.style.removeProperty(
                        "animation-delay"
                    );

                    elemento.style.removeProperty(
                        "animation-duration"
                    );

                }
            );


        /* =================================================
           DELAY INICIAL
        ================================================= */

        window.setTimeout(
            function () {

                comenzarIntro();

            },
            650
        );


        function comenzarIntro() {


/* =================================================
   TERMINAR PRE-INTRO
================================================= */

document.documentElement
    .classList
    .remove(
        "halley-preintro"
    );

            /* =================================================
               MENÚ
            ================================================= */

            var elementosMenu =
                document.querySelectorAll(
                    ".tatsu-header .tatsu-header-menu, " +
                    ".tatsu-header .tatsu-menu, " +
                    ".tatsu-header nav, " +
                    ".tatsu-header .tatsu-mobile-menu-icon, " +
                    ".tatsu-header .tatsu-hamburger, " +
                    ".tatsu-header .mobile-menu-icon"
                );


            elementosMenu.forEach(
                function (elemento) {

                    elemento.classList.add(
                        "halley-menu-aparecer"
                    );

                }
            );


            document.documentElement
                .classList
                .add(
                    "halley-hero-intro-running"
                );


            /* =================================================
               MÓDULO DEL TÍTULO
            ================================================= */

            var moduloTitulo =
                titulo.closest(
                    ".tatsu-module"
                ) ||
                titulo.parentElement;


            titulo.classList.add(
                "halley-hero-titulo-original"
            );


            /* =================================================
               NORMALIZAR TEXTO
            ================================================= */

            function normalizarTexto(texto) {

                return String(texto || "")
                    .normalize("NFD")
                    .replace(
                        /[\u0300-\u036f]/g,
                        ""
                    )
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .trim()
                    .toLowerCase();

            }


            /* =================================================
               OCULTAR RESTO DEL HERO
            ================================================= */

            var elementosOcultos = [];


            hero
                .querySelectorAll(
                    ".tatsu-module"
                )
                .forEach(
                    function (modulo) {

                        if (
                            modulo === moduloTitulo ||
                            modulo.contains(titulo)
                        ) {
                            return;
                        }


                        modulo.classList.add(
                            "halley-hero-elemento-oculto"
                        );


                        elementosOcultos.push(
                            modulo
                        );

                    }
                );


            /* =================================================
               CLASIFICAR ELEMENTOS
            ================================================= */

            var elementosTexto = [];
            var elementosFlecha = [];
            var elementosGif = [];
            var elementosOtros = [];


            elementosOcultos.forEach(
                function (elemento) {

                    var texto =
                        normalizarTexto(
                            elemento.textContent
                        );


                    var contieneGif =
                        !!elemento.querySelector(
                            'img[src*=".gif"], ' +
                            'img[src*=".GIF"], ' +
                            'video'
                        );


                    var contieneSvg =
                        !!elemento.querySelector(
                            "svg"
                        );


                    var contieneImagen =
                        !!elemento.querySelector(
                            "img"
                        );


                    if (
                        texto.includes(
                            "transforma tu estacion con halley"
                        )
                    ) {

                        elementosTexto.push(
                            elemento
                        );

                        return;
                    }


                    if (
                        contieneGif
                    ) {

                        elementosGif.push(
                            elemento
                        );

                        return;
                    }


                    if (
                        contieneSvg ||
                        contieneImagen
                    ) {

                        elementosFlecha.push(
                            elemento
                        );

                        return;
                    }


                    elementosOtros.push(
                        elemento
                    );

                }
            );


            /* =================================================
               PREPARAR HIJOS INTERNOS ANIMABLES
            ================================================= */

            function prepararContenidoAnimable(
                elemento,
                clase
            ) {

                var interno =
                    elemento.firstElementChild;


                if (!interno) {
                    interno = elemento;
                }


                interno.classList.add(
                    "halley-hero-contenido-interno",
                    clase
                );


                return interno;
            }


            var contenidosTexto = [];
            var contenidosFlecha = [];
            var contenidosGif = [];


            elementosTexto
                .concat(
                    elementosOtros
                )
                .forEach(
                    function (elemento) {

                        contenidosTexto.push(
                            prepararContenidoAnimable(
                                elemento,
                                "halley-hero-texto-interno"
                            )
                        );

                    }
                );


            elementosFlecha.forEach(
                function (elemento) {

                    contenidosFlecha.push(
                        prepararContenidoAnimable(
                            elemento,
                            "halley-hero-flecha-interna"
                        )
                    );

                }
            );


            elementosGif.forEach(
                function (elemento) {

                    contenidosGif.push(
                        prepararContenidoAnimable(
                            elemento,
                            "halley-hero-gif-interno"
                        )
                    );

                }
            );


            /* =================================================
               OVERLAY
            ================================================= */

            var overlay =
                document.createElement(
                    "div"
                );


            overlay.className =
                "halley-hero-overlay";


            hero.appendChild(
                overlay
            );


            /* =================================================
               MEDICIONES
            ================================================= */

            var heroRect =
                hero.getBoundingClientRect();


            var tituloRect =
                titulo.getBoundingClientRect();


            var estilo =
                window.getComputedStyle(
                    titulo
                );


            /* =================================================
               COPIA DEL TÍTULO
            ================================================= */

            var copia =
                titulo.cloneNode(
                    true
                );


            copia.removeAttribute(
                "id"
            );


            copia.classList.remove(
                "halley-hero-titulo-original"
            );


            copia.classList.add(
                "halley-hero-titulo-intro"
            );


            copia.innerHTML =
                '<span class="halley-hero-grupo-titulo halley-hero-grupo-1">' +
                    'TOMÁ EL' +
                '</span>' +

                ' ' +

                '<span class="halley-hero-grupo-titulo halley-hero-grupo-2">' +
                    '<span style="color:#43A6B2;">CONTROL</span> DE TU' +
                '</span>' +

                '<span class="halley-hero-grupo-titulo halley-hero-grupo-3 halley-hero-grupo-linea-final">' +
                    'ESTACIÓN DE SERVICIO' +
                '</span>';


            /* =================================================
               POSICIÓN FINAL REAL DEL TÍTULO
            ================================================= */

            var leftFinal =
                tituloRect.left -
                heroRect.left;


            var topFinal =
                tituloRect.top -
                heroRect.top;


            copia.style.left =
                leftFinal +
                "px";


            copia.style.top =
                topFinal +
                "px";


            copia.style.width =
                tituloRect.width +
                "px";


            copia.style.fontFamily =
                estilo.fontFamily;


            copia.style.fontSize =
                estilo.fontSize;


            copia.style.fontWeight =
                estilo.fontWeight;


            copia.style.lineHeight =
                estilo.lineHeight;


            copia.style.letterSpacing =
                estilo.letterSpacing;


            copia.style.textAlign =
                estilo.textAlign;


            copia.style.opacity =
                "1";


            overlay.appendChild(
                copia
            );


            /* =================================================
               ESCALA INICIAL
               69,375%
            ================================================= */

            var anchoObjetivo =
                heroRect.width *
                0.69375;


            var escala =
                anchoObjetivo /
                tituloRect.width;


            escala =
                Math.min(
                    escala,
                    2.65
                );


            /* =================================================
               POSICIÓN INICIAL
            ================================================= */

            var margenDerecho =
                heroRect.width *
                0.05;


            var desplazamientoExtraDerecha =
                heroRect.width *
                0.07;


            var anchoVisualInicial =
                tituloRect.width *
                escala;


            var leftInicial =
                heroRect.width -
                margenDerecho -
                anchoVisualInicial +
                desplazamientoExtraDerecha;


            var altoVisualInicial =
                tituloRect.height *
                escala;


            var topInicial =
                (
                    heroRect.height -
                    altoVisualInicial
                ) / 2;


            topInicial =
                Math.max(
                    topInicial,
                    20
                );


            var deltaX =
                leftInicial -
                leftFinal;


            var deltaY =
                topInicial -
                topFinal;


            var transformGrande =
                "translate(" +
                deltaX +
                "px, " +
                deltaY +
                "px) " +
                "scale(" +
                escala +
                ")";


            copia.style.transform =
                transformGrande;


            /* =================================================
               GRUPOS DEL TÍTULO
            ================================================= */

            var grupo1 =
                copia.querySelector(
                    ".halley-hero-grupo-1"
                );


            var grupo2 =
                copia.querySelector(
                    ".halley-hero-grupo-2"
                );


            var grupo3 =
                copia.querySelector(
                    ".halley-hero-grupo-3"
                );


            function animarGrupo(
                elemento,
                delay
            ) {

                return elemento.animate(

                    [

                        {
                            opacity: 0,
                            transform:
                                "translateY(20px)"
                        },

                        {
                            opacity: 1,
                            transform:
                                "translateY(0px)"
                        }

                    ],

                    {

                        duration:
                            504,

                        delay:
                            delay,

                        easing:
                            "cubic-bezier(0.22, 1, 0.36, 1)",

                        fill:
                            "forwards"

                    }

                );

            }


            /* =================================================
               MOSTRAR WRAPPER + ANIMAR HIJO INTERNO
            ================================================= */

            function mostrarConAnimacion(
                elementos,
                contenidos,
                claseAnimacion
            ) {

                elementos.forEach(
                    function (elemento) {

                        elemento
                            .classList
                            .remove(
                                "halley-hero-elemento-oculto"
                            );

                    }
                );


                contenidos.forEach(
                    function (interno) {

                        interno.classList.add(
                            claseAnimacion
                        );

                    }
                );

            }


            /* =================================================
               FASE 1
            ================================================= */

            var animacion1 =
                animarGrupo(
                    grupo1,
                    0
                );


            var animacion2 =
                animarGrupo(
                    grupo2,
                    140
                );


            var animacion3 =
                animarGrupo(
                    grupo3,
                    280
                );


            Promise
                .all(
                    [
                        animacion1.finished,
                        animacion2.finished,
                        animacion3.finished
                    ]
                )
                .then(
                    function () {

                        return new Promise(
                            function (resolver) {

                                window.setTimeout(
                                    resolver,
                                    135
                                );

                            }
                        );

                    }
                )
                .then(
                    function () {

                        /* =================================================
                           FASE 2
                        ================================================= */

                        var aterrizaje =
                            copia.animate(

                                [

                                    {
                                        opacity:
                                            1,

                                        transform:
                                            transformGrande
                                    },

                                    {
                                        opacity:
                                            1,

                                        transform:
                                            "translate(0px, 0px) scale(1)"
                                    }

                                ],

                                {

                                    duration:
                                        1385,

                                    easing:
                                        "cubic-bezier(0.4, 0, 0.2, 1)",

                                    fill:
                                        "forwards"

                                }

                            );


                        /* TEXTO */

                        window.setTimeout(
                            function () {

                                mostrarConAnimacion(
                                    elementosTexto.concat(
                                        elementosOtros
                                    ),
                                    contenidosTexto,
                                    "halley-hero-texto-aparecer"
                                );

                            },
                            650
                        );


                        /* FLECHA */

                        window.setTimeout(
                            function () {

                                mostrarConAnimacion(
                                    elementosFlecha,
                                    contenidosFlecha,
                                    "halley-hero-flecha-aparecer"
                                );

                            },
                            820
                        );


                        /* GIF */

                        window.setTimeout(
                            function () {

                                mostrarConAnimacion(
                                    elementosGif,
                                    contenidosGif,
                                    "halley-hero-gif-aparecer"
                                );

                            },
                            990
                        );


                        return aterrizaje.finished;

                    }
                )
                .then(
                    function () {

                        /* =================================================
                           CLON → TÍTULO ORIGINAL
                        ================================================= */

                        titulo
                            .classList
                            .remove(
                                "halley-hero-titulo-original"
                            );


                        copia.remove();


                        overlay.remove();


                        document.documentElement
                            .classList
                            .remove(
                                "halley-hero-intro-running"
                            );


                        window.setTimeout(
                            function () {

                                elementosOcultos
                                    .forEach(
                                        function (
                                            elemento
                                        ) {

                                            elemento
                                                .classList
                                                .remove(
                                                    "halley-hero-elemento-oculto"
                                                );


                                            elemento.style.setProperty(
                                                "opacity",
                                                "1",
                                                "important"
                                            );


                                            elemento.style.setProperty(
                                                "visibility",
                                                "visible",
                                                "important"
                                            );

                                        }
                                    );


                                contenidosTexto
                                    .concat(
                                        contenidosFlecha,
                                        contenidosGif
                                    )
                                    .forEach(
                                        function (interno) {

                                            interno.classList.remove(
                                                "halley-hero-texto-aparecer",
                                                "halley-hero-flecha-aparecer",
                                                "halley-hero-gif-aparecer"
                                            );

                                        }
                                    );


                                elementosMenu.forEach(
                                    function (
                                        elemento
                                    ) {

                                        elemento
                                            .classList
                                            .remove(
                                                "halley-menu-aparecer"
                                            );

                                    }
                                );

                            },
                            1600
                        );

                    }
                )
                .catch(
                    function () {

                        titulo
                            .classList
                            .remove(
                                "halley-hero-titulo-original"
                            );


                        elementosOcultos
                            .forEach(
                                function (
                                    elemento
                                ) {

                                    elemento
                                        .classList
                                        .remove(
                                            "halley-hero-elemento-oculto"
                                        );


                                    elemento.style.setProperty(
                                        "opacity",
                                        "1",
                                        "important"
                                    );


                                    elemento.style.setProperty(
                                        "visibility",
                                        "visible",
                                        "important"
                                    );

                                }
                            );


                        if (copia) {
                            copia.remove();
                        }


                        if (overlay) {
                            overlay.remove();
                        }


                        document.documentElement
                            .classList
                            .remove(
                                "halley-preintro",
                                "halley-hero-intro-running"
                            );

                    }
                );

        }

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            iniciarHeroHalley
        );

    } else {

        iniciarHeroHalley();

    }

})();
