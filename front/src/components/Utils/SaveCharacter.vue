<script setup>
import { ref } from "vue";
import { useCharacterSheetStore } from "@/store/characterSheetDB";
import { characterFunctions } from "@/store/characterSheet";

const characterSheetStore = useCharacterSheetStore();
const characterSheet = characterFunctions();

const saveNewCharacterSheet = async () => {
  const sheetToSend = JSON.parse(JSON.stringify(characterSheet)); // 👈 elimina Proxy

  // Asegurar que el campo lang tenga el formato correcto
  sheetToSend.character.lang = {
    languages: Object.keys(sheetToSend.character.lang || {}).filter(
      (lang) => sheetToSend.character.lang[lang] !== null
    ),
  };

  // Asegurar age como número
  sheetToSend.character.age = Number(sheetToSend.character.age || 0);

  console.log("📤 Enviando ficha limpia:", sheetToSend);
  await characterSheetStore.createCharacterSheet(sheetToSend);
};
</script>

<template>
  <div>
    <button @click="saveNewCharacterSheet">Guardar Ficha</button>

    <p v-if="characterSheetStore.loading">Guardando ficha...</p>
    <p v-if="characterSheetStore.error" class="error">
      Error: {{ characterSheetStore.error.message }}
    </p>
  </div>
</template>
