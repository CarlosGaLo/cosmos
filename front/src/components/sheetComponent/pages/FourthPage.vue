<script setup>
import SaveCharacter from "@/components/Utils/SaveCharacter.vue";
import CompleteSheet from "../CompleteSheet.vue";
import Descargable from "@/components/Utils/Descargable.vue";
</script>

<template>
  <section>
    <Descargable> <CompleteSheet></CompleteSheet></Descargable>
    <SaveCharacter> </SaveCharacter>
  </section>
</template>

<style scoped></style>
