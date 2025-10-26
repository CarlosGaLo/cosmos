<script setup>
import { ref, onUnmounted, onMounted } from "vue";

// Detectar si es un móvil
const isMobile = ref(window.innerWidth <= 768);

// Escuchar cambios en el tamaño de la pantalla para actualizar isMobile
const updateMobileStatus = () => {
  isMobile.value = window.innerWidth <= 768;
};
window.addEventListener("resize", updateMobileStatus);

// Posición inicial: margen inferior izquierdo
const position = ref({ x: 20, y: window.innerHeight - 50 });
const size = ref({ width: 500, height: 400 });
const isDragging = ref(false);
const isResizing = ref(false);
const isCollapsed = ref(true);
const hasBeenClicked = ref(false); // Nuevo estado para detectar el primer clic
const tabRef = ref(null);

let lastMouseX = 0;
let lastMouseY = 0;

// Función para mover la ventana
const startDrag = (event) => {
  if (!tabRef.value || isCollapsed.value || isResizing.value) return;

  isDragging.value = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
};

const drag = (event) => {
  if (!isDragging.value) return;

  const deltaX = event.clientX - lastMouseX;
  const deltaY = event.clientY - lastMouseY;

  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  requestAnimationFrame(() => {
    position.value.x += deltaX;
    position.value.y += deltaY;
  });
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
};

// Alternar entre plegar/desplegar
const toggleCollapse = () => {
  if (!isCollapsed.value) {
    // Se pliega en el margen inferior izquierdo
    position.value = { x: 20, y: window.innerHeight - 50 };
  } else {
    // Si es la primera vez que se abre, ir a (100, 500)
    if (!hasBeenClicked.value) {
      position.value = { x: 100, y: 500 };
      hasBeenClicked.value = true; // Marcar que ya se ha hecho clic una vez
    } else {
      // Si ya ha sido abierto antes, volver a la posición estándar
      position.value = { x: 100, y: 100 };
    }
  }
  isCollapsed.value = !isCollapsed.value;
};

// Se despliega si está plegada y se hace clic en la pestaña
const handleClick = () => {
  if (isCollapsed.value) {
    toggleCollapse();
  }
};

// Función para iniciar redimensionamiento
const startResize = (event) => {
  if (isCollapsed.value) return;
  isResizing.value = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  document.addEventListener("mousemove", resize);
  document.addEventListener("mouseup", stopResize);
};

// Función para redimensionar la ventana
const resize = (event) => {
  if (!isResizing.value) return;

  const deltaX = event.clientX - lastMouseX;
  const deltaY = event.clientY - lastMouseY;

  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  requestAnimationFrame(() => {
    size.value.width = Math.max(150, size.value.width + deltaX);
    size.value.height = Math.max(100, size.value.height + deltaY);
  });
};

// Función para detener el redimensionamiento
const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener("mousemove", resize);
  document.removeEventListener("mouseup", stopResize);
};

// Asegurar limpieza de eventos si el componente se desmonta
onUnmounted(() => {
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("mousemove", resize);
  document.removeEventListener("mouseup", stopResize);
  window.removeEventListener("resize", updateMobileStatus);
});

// Si es móvil, ocultar la pestaña desde el inicio
onMounted(updateMobileStatus);
</script>

<template>
  <div
    v-if="!isMobile"
    ref="tabRef"
    class="floating-tab"
    :class="{ collapsed: isCollapsed }"
    :style="{
      left: position.x + 'px',
      top: position.y + 'px',
      width: isCollapsed ? '50px' : size.width + 'px',
      height: isCollapsed ? '30px' : size.height + 'px',
    }"
    @click="handleClick"
  >
    <div class="header" @mousedown="startDrag">
      Info
      <button class="toggle-btn" @click.stop="toggleCollapse">
        {{ isCollapsed ? "🔽" : "🔼" }}
      </button>
    </div>
    <div v-if="!isCollapsed" class="content">
      <slot>Contenido de la pestaña</slot>
    </div>
    <div class="resize-handle" @mousedown="startResize"></div>
  </div>
</template>

<style scoped>
.floating-tab {
  position: fixed;
  background: white;
  border: 2px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  user-select: none;
  z-index: 1000;
  transition: left 0.1s ease, top 0.1s ease;
  min-width: 150px;
  min-height: 100px;
  overflow: hidden;
}

.header {
  background: #007bff;
  color: white;
  padding: 8px;
  cursor: grab;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
}

.content {
  padding: 10px;
  max-height: calc(100% - 40px);
  overflow: auto;
}

.floating-tab.collapsed {
  width: 50px;
  height: 30px;
  opacity: 0.8;
  overflow: hidden;
  background: #007bff;
  color: white;
  text-align: center;
  line-height: 30px;
  border-radius: 15px;
  cursor: pointer;
}

/* Botón para redimensionar */
.resize-handle {
  position: absolute;
  width: 15px;
  height: 15px;
  bottom: 0;
  right: 0;
  background: #007bff;
  cursor: nwse-resize;
  border-bottom-right-radius: 8px;
}
</style>
