<script setup>
import LanguajesSheet from "@/components/sheetComponent/pieces/LanguajesSheet.vue";
import NameSheet from "@/components/sheetComponent/pieces/NameSheet.vue";
import QuestSheet from "@/components/sheetComponent/pieces/QuestSheet.vue";
import SpecieSheet from "@/components/sheetComponent/pieces/SpecieSheet.vue";
</script>

<template>
  <section>
    <NameSheet></NameSheet>
    <SpecieSheet></SpecieSheet>
    <LanguajesSheet></LanguajesSheet>
    <QuestSheet></QuestSheet>
  </section>
</template>

<style scoped></style>
