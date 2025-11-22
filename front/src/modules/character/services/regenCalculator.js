// services/regenCalculator.js
export class RegenCalculator {
  static calculateLifeBonus(feats, specie) {
    let bonus = 0;

    // Ejemplo: feat "Regeneración rápida" da +2
    if (feats.some((f) => f.name === "Regeneración rápida")) {
      bonus += 2;
    }

    // Ejemplo: Urcan tiene +1 a regen vida
    if (specie.toLowerCase() === "humano" || specie.toLowerCase() === "human" ) {
      bonus += 2;
    }

    return bonus;
  }

  static calculateEnergyBonus(feats, specie) {
        let bonus = 0;

    // Ejemplo: feat "Regeneración rápida" da +2
    if (feats.some((f) => f.name === "Regeneración rápida")) {
      bonus += 2;
    }

    // Ejemplo: Urcan tiene +1 a regen vida
    if (specie === "urcan") {
      bonus += 1;
    }

    return bonus;
  }
}
