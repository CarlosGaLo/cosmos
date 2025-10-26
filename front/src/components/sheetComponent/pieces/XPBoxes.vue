<script setup></script>

<template>
  <section class="center">
    <div class="flex frame-left">
        <h2>XP Total</h2>
        <p>100</p>
    </div>
    <div class="flex frame-right">
        <h2>XP Libre</h2>
        <p>100</p>
    </div>
  </section>
</template>

<style scoped>
.center{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 70px;
    background-image: url("../../../assets/images-svg/MOVILE_XP_routing.svg");
    background-repeat: no-repeat;
    background-position-x: 50%;
    background-position-y: 15px;
    height: 90px;
}
.flex{
    display: flex;
    flex-direction: column;
    align-items: center;
}

.flex h2{
    font-family: FedraNumberMedium;
    font-size: 18px;

}

.flex p{
    font-family: FedraNumberLight;
    font-size: 16px;
    margin: 0;
}
</style>