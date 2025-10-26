import { defineStore } from "pinia";

export default defineStore("adventures", {
  state: () => {
    return {
      player: {
        attributes: {
          art: 1,
          mov: 2,
          cul: 3,
          sup: 4,
          asa: 5,
          sob: 6,
          med: 7,
          com: 8,
          vig: 9,
        },
        inventory: [
          {
            id: 0,
            name: "sword",
            src: "https://www.collinsdictionary.com/images/full/sword_120114541.jpg",
            alt: "img alt",
            onClick: "addToAttr(asa, 2)",
            passiveEffect: null,
          },
          {
            id: 1,
            name: "shield",
            src: "https://st.depositphotos.com/1281871/3023/i/950/depositphotos_30233041-stock-photo-metal-shield.jpg",
            alt: "img alt",
            onClick: "addToAttr(vig, 2)",
            passiveEffect: null,
          }
        ],
      }
    };
  },
  actions: {
    addToAttr(attr, quantity) {
      this.player.attributes[attr] += quantity;
    },    
  },
});
