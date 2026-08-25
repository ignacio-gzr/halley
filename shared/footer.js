/* ========================================
   AÑO COPYRIGHT AUTOMÁTICO
======================================== */

document.addEventListener("DOMContentLoaded", function () {

  var texto = document.querySelector("#copyright-halley");

  if (!texto) return;

  texto.innerHTML =
    new Date().getFullYear() +
    " © Halley - Un producto de Komeet S.A. - Buenos Aires, Argentina";

});
