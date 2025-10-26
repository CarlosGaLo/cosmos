<template>
    <div class="main-menu">
        <router-link to="/adventuresPlay" active-class="active"> <button class="game-button">Jugar</button></router-link>
        <button class="game-button">Crea tu historia</button>
        <button class="game-button">Elegir personaje</button>
    </div>
</template>


<script setup>
</script>

<style lang="scss">
.main-menu{
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    justify-content: space-between;
    align-items: stretch;

    .game-button{
        margin: 10px;
    }
}
</style>