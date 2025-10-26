import { defineStore } from "pinia";

export const characterFunctions = defineStore("characterFunctions", {
  state: () => {
    return {
      metaData: {
        freeXP: 0,
        usedXP: 0,
        featXP: 200,
        competencesXP: 0,
        playerName: "",
        campCost: 100,
        skillCost: 30,
        specialityCost: 10,
        comments: "",
        id: null,
        specImagePath: "",
        specShieldPath: "",
        magicXP: 0,
        martialXP: 0,
        characterType: {
          label: "",
          xp: 0,
        },
        skillCapMultiplier: 5,
      },
      character: require("../dataBase/characterTemplates/characterEmpty.json"),
      speciesTemplates: {
        nr: require("../dataBase/characterTemplates/nospecie.json"),
        hum: require("../dataBase/characterTemplates/human.json"),
        nam: require("../dataBase/characterTemplates/namester.json"),
        kor: require("../dataBase/characterTemplates/kordun.json"),
        urc: require("../dataBase/characterTemplates/urcan.json"),
        zan: require("../dataBase/characterTemplates/zannin.json"),
        ner: require("../dataBase/characterTemplates/nergalM.json"),
      },
      competences: [],
      feats: [],
      unfeats: [],
      zonaAfin: [],
      languages: [],
      spells: [],
      martials: [],
      speed: 0,
    };
  },
  getters: {
    getcharacterSheet() {
      return this.character;
    },
    getAgeCharacter() {
      return this.character.age;
    },
    getAgeMod() {
      return this.character.ageMod;
    },
    getspecieCh() {
      return this.character.specie;
    },
    getspecieMod() {
      return this.character.specieMod;
    },
    getspecieAttCap() {
      return this.character.specieCampCap;
    },
    getCamps() {
      return this.character.camp;
    },
    getCampArt() {
      return parseInt(this.character.camp.art);
    },
    getCampMov() {
      return parseInt(this.character.camp.mov);
    },
    getCampCul() {
      return parseInt(this.character.camp.cul);
    },
    getCampSup() {
      return parseInt(this.character.camp.sup);
    },
    gettCampAsa() {
      return parseInt(this.character.camp.asa);
    },
    getCampSob() {
      return parseInt(this.character.camp.sob);
    },
    getCampMed() {
      return parseInt(this.character.camp.med);
    },
    getCampCom() {
      return parseInt(this.character.camp.com);
    },
    getCampVig() {
      return parseInt(this.character.camp.vig);
    },
    getRegenLife() {
      return this.character.regen.life;
    },
    getRegenEnergy() {
      return this.character.regen.energy;
    },
    getRegenMana() {
      return this.character.regen.mana;
    },
    getTurn() {
      let result = 0;
      return result;
    },
    getCurrentSkill() {
      return this.character.currentSkill;
    },
    getSkillArray() {
      return this.character.skillArray;
    },
    getLanguages() {
      return this.languages;
    },
  },
  actions: {
    selectCharacterType(type) {
      this.metaData.characterBase = type;
      switch (type.label) {
        case "Héroe":
          this.metaData.competencesXP += 200;
          this.metaData.featXP = 100;
          this.metaData.freeXP = 1000 - this.metaData.usedXP;
          break;
        case "Avanzado":
          this.metaData.competencesXP += 100;
          this.metaData.freeXP = 600 - this.metaData.usedXP;
          break;
        case "Normal":
          this.metaData.freeXP = 200 - this.metaData.usedXP;
          break;
        default:
          console.warn(`Tipo de ficha desconocido: ${type.label}`);
          break;
      }
      this.fullfillMagics();
      this.fullfillMarcial();
    },
    fullfillMagics() {
      // Extraer valores de hechicería
      const hechiceria =
        this.character.camp.sob.skills.hechiceria.specialities || {};
      this.metaData.magicXP = Object.values(hechiceria).map((item) => ({
        name: item.name,
        total: item.final,
      }));
    },
    fullfillMarcial() {
      // Extraer valores de marcial
      const marcial =
        this.character.camp.vig.skills.energia.specialities.marcial || {};
      this.metaData.martialXP = {
        name: marcial.name,
        total: marcial.final,
      };
    },
    calculateXP(camp, atrib, spec, other) {
      if (camp) {
        this.metaData.freeXP -= camp * this.metaData.campCost;
        this.metaData.usedXP += camp * this.metaData.campCost;
      }
      if (atrib) {
        this.metaData.freeXP -= atrib * this.metaData.skillCost;
        this.metaData.usedXP += atrib * this.metaData.skillCost;
      }
      if (spec) {
        this.metaData.freeXP -= spec * this.metaData.specialityCost;
        this.metaData.usedXP += spec * this.metaData.specialityCost;
      }
      if (other) {
        this.metaData.freeXP -= other;
        this.metaData.usedXP += other;
      }
    },
    calculateXPInverted(camp, atrib, spec, other) {
      if (camp) {
        this.metaData.freeXP += camp * this.metaData.campCost;
        this.metaData.usedXP -= camp * this.metaData.campCost;
      }
      if (atrib) {
        this.metaData.freeXP += atrib * this.metaData.skillCost;
        this.metaData.usedXP -= atrib * this.metaData.skillCost;
      }
      if (spec) {
        this.metaData.freeXP += spec * this.metaData.specialityCost;
        this.metaData.usedXP -= spec * this.metaData.specialityCost;
      }
      if (other) {
        this.metaData.freeXP += other;
        this.metaData.usedXP -= other;
      }
    },
    setcharacterSheet(character) {
      this.character = character;
    },
    getspecie() {
      return this.character.specie;
    },
    setName(name) {
      if (!name) return;
      this.character.name = name;
    },
    getName() {
      return this.character.name;
    },
    getSex() {
      return this.character.sex;
    },
    getAge() {
      return this.character.age;
    },
    getAgeState() {
      return this.character.ageState;
    },
    getImgPath() {
      return this.metaData.specImagePath;
    },
    getShieldPath() {
      return this.metaData.specShieldPath;
    },
    getSpecieFeats() {
      return this.feats;
    },
    setSex(sex) {
      this.character.sex = sex;
    },
    setAge(age) {
      this.character.age = age;
    },
    setAgeState(ageState) {
      this.character.ageState = ageState;
    },
    getCampCode(camp) {
      let campCode = camp;
      if (camp.name) campCode = camp.name;
      if (campCode.toLowerCase() === "arte") campCode = "art";
      else if (campCode.toLowerCase() === "movimiento") campCode = "mov";
      else if (campCode.toLowerCase() === "cultura") campCode = "cul";
      else if (campCode.toLowerCase() === "supervivencia") campCode = "sup";
      else if (campCode.toLowerCase() === "sobrenatural") campCode = "sob";
      else if (campCode.toLowerCase() === "vigor") campCode = "vig";
      return campCode;
    },
    setSkillCap(campName) {
      const camp = this.getCampCode(campName);
      const skills = this.character.camp[camp].skills;
      Object.values(skills).forEach((skill) => {
        skill.cap =
          this.character.camp[camp].total * this.metaData.skillCapMultiplier;
      });
    },
    setHeriForSpeciality(skill, heri) {
      Object.values(skill.specialities).forEach((speciality) => {
        speciality.heri = heri;
      });
    },
    setSkillAtrib(campName) {
      const camp = this.getCampCode(campName);
      const skills = this.character.camp[camp].skills;
      Object.values(skills).forEach((skill) => {
        skill.atrib = 2 * Number(this.character.camp[camp].total);
        skill.total = skill.atrib + skill.base + skill.mod;
        this.setSpecialities(camp, skill);
      });
    },
    setSpecialities(camp, skill) {
      const specialities =
        this.character.camp[camp].skills[skill.name].specialities;
      Object.values(specialities).forEach((speciality) => {
        skill.cap = 5;
        speciality.atrib = skill.total;
        if (
          speciality.base > this.character.camp[camp].skills[skill.name.final]
        )
          speciality.base = this.character.camp[camp].skills[skill.name.final];
        speciality.final = speciality.base + speciality.atrib;
      });
    },
    calculateTotalCamp(camp) {
      camp.total = camp.base + camp.specie + camp.mod + camp.age;
    },
    updateSpeciality(specialityName, newValue) {
      // Verifica si this.character.camp existe y es un objeto
      if (
        !this.character ||
        !this.character.camp ||
        typeof this.character.camp !== "object"
      ) {
        console.error("Error: this.character.camp no es un objeto válido.");
        return;
      }

      // Iterar sobre los atributos de this.character.camp
      Object.values(this.character.camp).forEach((attribute) => {
        // Verificar si el atributo es un objeto y contiene `skills`
        if (typeof attribute === "object" && attribute.skills) {
          // Iterar sobre cada skill dentro de skills
          Object.values(attribute.skills).forEach((skill) => {
            // Verificar si `specialities` existe en skill
            if (skill.specialities && typeof skill.specialities === "object") {
              // Buscar la specialidad dentro de specialities
              const speciality = skill.specialities[specialityName];

              if (speciality) {
                // Modificar la propiedad base
                if (newValue > skill.total) newValue = skill.total;
                speciality.base = newValue;
              }
            }
          });
        }
      });
    },
    calculateAge() {
      //Clear Age
      if (this.character.ageState.toLowerCase() === "joven") {
        this.character.camp.mov.age = 0;
        this.character.camp.sup.age = 0;
      } else if (this.character.ageState.toLowerCase() === "adulto") {
        this.character.camp.mov.age = 0;
        this.character.camp.vig.age = 0;
      } else if (this.character.ageState.toLowerCase() === "anciano") {
        this.character.camp.cul.age = 0;
        this.character.camp.sup.age = 0;
      }
      //Set Age
      if (this.character.ageState.toLowerCase() === "joven") {
        this.character.camp.mov.age = 1;
        this.character.camp.sup.age = 1;
      } else if (this.character.ageState.toLowerCase() === "adulto") {
        this.character.camp.mov.age = 1;
        this.character.camp.vig.age = 1;
      } else if (this.character.ageState.toLowerCase() === "anciano") {
        this.character.camp.cul.age = 1;
        this.character.camp.sup.age = 1;
      }
    },
    fullfillSheet() {
      this.calculateAge();
      Object.values(this.character.camp).forEach((camp) => {
        if (camp.base > camp.final - camp.specie - camp.age)
          camp.base = Math.max(camp.final - camp.specie - camp.age, 0);
        this.calculateTotalCamp(camp);
        this.setSkillAtrib(camp.name);
        this.setSkillCap(camp);
      });
      this.fullfillMagics();
      this.fullfillMarcial();
    },
    loadTemplate(specie, newSex) {
      // languages issues
      if (
        specie.toLowerCase() === "humano" ||
        specie.toLowerCase() === "Humano"
      )
        specie = "human";
      else if (
        specie.toLowerCase() === "kordún" ||
        specie.toLowerCase() === "Kordún" ||
        specie.toLowerCase() === "Kordun"
      )
        specie = "kordun";
      else if (
        specie.toLowerCase() === "námester" ||
        specie.toLowerCase() === "Námester" ||
        specie.toLowerCase() === "Námester"
      )
        specie = "namester";

      let specieTemplate = "";
      let specieFeatsDB = require("../dataBase/feats/feats.json");
      let name = characterFunctions().getName();
      let age = characterFunctions().getAge();
      let ageState = characterFunctions().getAgeState();
      let specImagePath = "";
      switch (specie) {
        case "human":
          specieTemplate = require("../dataBase/characterTemplates/human.json");
          this.feats = specieFeatsDB.humanFeats;
          break;
        case "kordun":
          specieTemplate = require("../dataBase/characterTemplates/kordun.json");
          this.feats = specieFeatsDB.kordunFeats;
          break;
        case "urcan":
          specieTemplate = require("../dataBase/characterTemplates/urcan.json");
          this.feats = specieFeatsDB.urcanFeats;
          break;
        case "zannin":
          specieTemplate = require("../dataBase/characterTemplates/zannin.json");
          this.feats = specieFeatsDB.zanninFeats;
          break;
        case "namester":
          specieTemplate = require("../dataBase/characterTemplates/namester.json");
          this.feats = specieFeatsDB.namesterFeats;
          break;
        case "nergal":
          if (newSex === "Femenino") {
            specieTemplate = require("../dataBase/characterTemplates/nergalF.json");
            this.feats = specieFeatsDB.nergalFemaleFeats;
          } else {
            specieTemplate = require("../dataBase/characterTemplates/nergalM.json");
            this.feats = specieFeatsDB.nergalMaleFeats;
          }
          break;
        default:
          console.error("Especie no reconocida");
          break;
      }

      characterFunctions().setcharacterSheet(specieTemplate);
      this.setName(name);
      this.setAge(age);
      this.setAgeState(ageState);
      this.setSex(newSex);

      //We create the img paths********************
      specImagePath = "/images-png/species/" + specie;
      if (characterFunctions().getSex().toLowerCase() == "masculino") {
        specImagePath += "_m.png";
      } else {
        specImagePath += "_f.png";
      }
      this.metaData.specImagePath = specImagePath;

      this.metaData.specShieldPath = "/images-png/shields/" + specie + ".png";
      //End of images paths************************
      this.fullfillSheet();
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: "characterSheet",
        storage: localStorage,
      },
    ],
  },
});
