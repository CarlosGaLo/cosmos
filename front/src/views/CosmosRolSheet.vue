<template>
  <section class="character-sheet">
    <LoadCharacter />

    <NavigationContent
      :stepNumber="page"
      @add="pageAdd"
      @substract="pageBack"
    />

    <component :is="currentPage" />

    <!-- Mostrar FloatingTab solo si NO estamos en la página 4 -->
    <FloatingTab v-if="page !== 4">
      <component :is="currentFloatingComponent" />
    </FloatingTab>

    <NavigationContent
      :stepNumber="page"
      @add="pageAdd"
      @substract="pageBack"
    />
  </section>
</template>

<script setup>
import {
  ref,
  computed,
  defineAsyncComponent,
  onMounted,
  onBeforeUnmount,
} from "vue";

// Importación dinámica de páginas
const pages = [
  defineAsyncComponent(() =>
    import("@/components/sheetComponent/pages/FirstPage.vue")
  ),
  defineAsyncComponent(() =>
    import("@/components/sheetComponent/pages/SecondPage.vue")
  ),
  defineAsyncComponent(() =>
    import("@/components/sheetComponent/pages/ThirdPage.vue")
  ),
  defineAsyncComponent(() =>
    import("@/components/sheetComponent/pages/FourthPage.vue")
  ),
];

// Importación de componentes para FloatingTab
const floatingComponents = [
  defineAsyncComponent(() =>
    import("@/components/sheetComponent/info/GeneralInfo.vue")
  ),
  defineAsyncComponent(() =>
    import("@/components/sheetComponent/info/SheetInfo.vue")
  ),
  defineAsyncComponent(() =>
    import("@/components/sheetComponent/info/PowersInfo.vue")
  ),
  null, // Página 4 -> No se muestra FloatingTab
];

// Importación de otros componentes
import NavigationContent from "@/components/sheetComponent/pieces/NavigationContent.vue";
import LoadCharacter from "@/components/Utils/LoadCharacter.vue";
import FloatingTab from "@/components/Utils/FloatingTab.vue";

// Estado reactivo para la página actual (AHORA EMPIEZA EN 1)
const page = ref(1);

// Computed para obtener el componente actual (AHORA SE AJUSTA EL ÍNDICE)
const currentPage = computed(() => pages[page.value - 1]);

// Computed para el componente dentro de FloatingTab (cambia según la página)
const currentFloatingComponent = computed(
  () => floatingComponents[page.value - 1]
);

// Funciones para cambiar de página
function pageAdd() {
  if (page.value < pages.length) page.value++;
}

function pageBack() {
  if (page.value > 1) page.value--;
}

// Manejo del evento beforeunload
function handleBeforeUnload(event) {
  event.preventDefault();
  event.returnValue = ""; // Esto activa el mensaje genérico del navegador
}

// Manejo del evento popstate (para navegación hacia atrás/adelante)
function handlePopState(event) {
  const confirmLeave = confirm("Vas a salir sin guardar. ¿Estás seguro?");
  if (!confirmLeave) {
    // Si el usuario cancela, volvemos al estado actual
    history.pushState(null, "", location.href); // Mantener al usuario en la página
  } else {
    // Si el usuario confirma, permitimos la navegación
    window.removeEventListener("popstate", handlePopState);
  }
}

onMounted(() => {
  // Registrar eventos
  window.addEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("popstate", handlePopState);

  // Agregar un estado inicial al historial para manejar popstate
  history.pushState(null, "", location.href);
});

onBeforeUnmount(() => {
  // Eliminar eventos
  window.removeEventListener("beforeunload", handleBeforeUnload);
  window.removeEventListener("popstate", handlePopState);
});
</script>

<style scoped>
.character-sheet {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
