/* ========================================
   HEADER FIJO + FONDO AL SCROLL / MENÚ ABIERTO
======================================== */

document.addEventListener("DOMContentLoaded", function () {

  var header = document.querySelector(".tatsu-header");

  if (!header) return;


  function menuEstaAbierto() {

    return document.querySelector(
      ".tatsu-mobile-menu-wrap.open, " +
      ".tatsu-mobile-menu-wrap.active, " +
      ".tatsu-mobile-menu.open, " +
      ".tatsu-mobile-menu.active, " +
      ".tatsu-mobile-navigation.open, " +
      ".tatsu-mobile-navigation.active"
    );

  }


  function actualizarHeader() {

    if (
      window.scrollY > 30 ||
      menuEstaAbierto()
    ) {

      header.classList.add(
        "header-scrolled"
      );

    } else {

      header.classList.remove(
        "header-scrolled"
      );

    }

  }


  window.addEventListener(
    "scroll",
    actualizarHeader
  );


  document.addEventListener(
    "click",
    function () {

      setTimeout(
        actualizarHeader,
        100
      );

    }
  );


  setInterval(
    actualizarHeader,
    300
  );


  actualizarHeader();

});
