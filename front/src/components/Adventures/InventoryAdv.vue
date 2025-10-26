<template>
  <section class="character-data">
    <div class="attributes">
      <ul class="attribute-list">
        <li v-for="attr in attributesArray" :key="attr">
          <span>{{ attr }}: {{ attributes[attr] }}</span>
        </li>
      </ul>
    </div>
    <div class="inventory">
      <ul class="inventory-list">
        <li v-for="item in inventory" :key="item.id">
          <span class="item" @click="itemActiveAction(item.onClick)">
            <img class="item-img" :src="item.src" :alt="item.alt" width="50" height="50">
            <span>{{ item.name }}</span>
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import adventuresStore from "@/store/adventuresStore.js";

const adventures = adventuresStore();
const attributes = adventures.player.attributes;
const attributesArray = Object.keys(attributes);
const inventory = adventures.player.inventory;

const itemActiveAction = (itemAction) => {
  adventures.addToAttr("vig", 1);
}
</script>

<style lang="scss">
.character-data {
  width: 100%;
  background-color: aqua;

  .attributes {
    width: 100%;
    border-bottom: 1px solid black;

    .attribute-list {
      list-style: none;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
  }

  .inventory {
    .inventory-list {
      list-style: none;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 25px;

      .item {
        display: flex;
        flex-direction: column;

        .item-img {
          width: 50px;
          height: 50px;
        }
      }
    }
  }
}
</style>
