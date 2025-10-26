<template>
  <div class="container">
    <!-- Contenido a descargar en PDF -->
    <section id="descargable">
      <slot></slot>
    </section>
    <button @click="descargarPDF" class="boton-descargar">Descargar PDF</button>
  </div>
</template>

<script setup>
import html2pdf from "html2pdf.js";

const descargarPDF = () => {
  // Seleccionamos el elemento que queremos convertir a PDF
  const element = document.getElementById("descargable");

  // Opciones de configuración para el PDF
  const opciones = {
    margin: 1,
    filename: "ficha-personaje.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  // Generamos el PDF
  html2pdf().set(opciones).from(element).save();
};
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.boton-descargar {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.boton-descargar:hover {
  background-color: #45a049;
}
</style>
