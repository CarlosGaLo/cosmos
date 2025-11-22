import { ref, computed } from "vue";
import { RegenCalculator } from "../services/regenCalculator";

/**
 * Estado reactivo del personaje
 * Separado de la lógica para facilitar testing y mantenimiento
 */
export function useCharacterState() {
  // ==================== METADATA ====================
  const metaData = ref({
    freeXP: 0,
    usedXP: 0,
    featXP: 0,
    competencesXP: 0,
    magicXP: [],
    martialXP: 0,
    playerName: "",
    campCost: 100,
    purchasedMagicSpecialties: [],
    maxMagicSpecialties: 0,
    skillCost: 30,
    specialityCost: 10,
    comments: "",
    id: null,
    specImagePath: "",
    specShieldPath: "",
    unfeatXP: 0,
    skillCapMultiplier: 5,
    allowNegativeXP: false,
    martialXP: [],
    characterType: {
      label: "",
      xp: 0,
    },
  });

  // ==================== CHARACTER ====================
  const character = ref({
    name: "",
    specie: "",
    specieState: "", // humano, kordun, etc
    age: 0,
    ageState: "Adulto", // Joven, Adulto, Anciano
    sex: "Masculino",
    regen: {
      life: 0,
      mana: 0,
      energy: 0,
    },
    camp: {
      art: null,
      mov: null,
      cul: null,
      sup: null,
      sob: null,
      vig: null,
    },
    lang: {
      languages: [],
    },
  });

  // ==================== LISTS ====================
  const competences = ref([]);
  const feats = ref([]);
  const unfeats = ref([]);
  const zonaAfin = ref([]);
  const languages = ref([]);
  const spells = ref([]);
  const martials = ref([]);
  const speed = ref(0);

  // ==================== COMPUTED ====================
  const totalXP = computed(() => metaData.value.freeXP + metaData.value.usedXP);

  const hasSpecie = computed(() => !!character.value.specie);

  const hasValidAge = computed(() => {
    return ["Joven", "Adulto", "Anciano"].includes(character.value.ageState);
  });

  const allCamps = computed(() => {
    return Object.values(character.value.camp).filter((camp) => camp !== null);
  });

  // Computed para magia (campo Sobrenatural)
  const hasMagicAccess = computed(() => {
    const sob = character.value.camp.sob;
    if (!sob) return false;

    const hechiceria = sob.skills?.hechiceria;
    return sob.base > 0 && hechiceria?.base > 0;
  });

  // Computed para artes marciales (campo Vigor)
  const hasMartialAccess = computed(() => {
    const vig = character.value.camp.vig;
    if (!vig) return false;

    const energia = vig.skills?.energia;
    const marcial = energia?.specialities?.marcial;
    return vig.base > 0 && marcial?.base > 0;
  });

  // ==================== COMPUTED REGENERATION ====================

  const lifeRegen = computed(() => {
    const vig = character.value.camp.vig;
    if (!vig) return 0;

    const vigTotal = vig.total || 0;
    const bonuses = RegenCalculator.calculateLifeBonus(
      feats.value,
      character.value.specieState
    );

    return vigTotal + bonuses;
  });

  const energyRegen = computed(() => {
    const sob = character.value.camp.sob;
    const sup = character.value.camp.sup;
    if (!sob || !sup) return 0;

    const sobTotal = sob.total || 0;
    const supTotal = sup.total || 0;
    const bonuses = RegenCalculator.calculateEnergyBonus(
      feats.value,
      character.value.specieState
    );

    return sobTotal + supTotal + bonuses;
  });

  const manaRegen = computed(() => {
    const sob = character.value.camp.sob;
    const sup = character.value.camp.sup;
    if (!sob || !sup) return 0;

    const sobTotal = sob.total || 0;
    const supTotal = sup.total || 0;
    const bonuses = RegenCalculator.calculateEnergyBonus(
      feats.value,
      character.value.specieState
    );

    return sobTotal + supTotal + bonuses;
  });

  // ==================== RETURN ====================
  return {
    // State
    metaData,
    character,
    competences,
    feats,
    unfeats,
    zonaAfin,
    languages,
    spells,
    martials,
    speed,

    // Computed
    totalXP,
    hasSpecie,
    hasValidAge,
    allCamps,
    hasMagicAccess,
    hasMartialAccess,

    // Regeneraciones
    lifeRegen,
    energyRegen,
    manaRegen,
  };
}
