<script setup></script>

<template>
  <section class="center">
    <div class="stylish-line"></div>
    <div class="text"><slot /></div>
    <div class="stylish-line"></div>
  </section>
</template>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
}

.stylish-line {
  width: 60%;
  position: relative;
  height: 3px;
  background-color: var(--color-medium-blue);
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

.text {
  font-size: 30px;
}
</style>
