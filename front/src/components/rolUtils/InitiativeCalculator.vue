<template>
  <div class="hc-theme p-4 space-y-6">
    <!-- Header -->
    <header class="hc-card flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        Calculador de Iniciativa — Anima: Beyond Fantasy
      </h1>
      <div class="space-x-2">
        <button class="hc-btn" @click="rollAll">Recalcular todos</button>
        <button class="hc-btn" @click="clearLogs">Limpiar registro</button>
      </div>
    </header>

    <!-- Characters Table -->
    <section class="hc-card">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-semibold">Personajes</h2>
        <small class="opacity-80">Ordenados por turno final (desc.)</small>
      </div>
      <div class="overflow-x-auto">
        <table class="hc-table min-w-full text-sm">
          <thead>
            <tr>
              <th class="text-left py-2 pr-4">#</th>
              <th class="text-left py-2 pr-4">Nombre</th>
              <th class="text-right py-2 pr-4">Base</th>
              <th class="text-right py-2 pr-4">Mod</th>
              <th class="text-right py-2 pr-4">Final</th>
              <th class="text-left py-2 pr-4">Ventajas ≥150</th>
              <th class="text-left py-2 pr-4">Última tirada</th>
              <th class="text-left py-2 pr-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(c, idx) in sortedCharacters"
              :key="c.id"
              class="align-top"
              :class="{
                'edge-win': dominanceMap.get(c.id)?.dominates.length,
                'edge-lose':
                  dominanceMap.get(c.id)?.dominatedBy.length &&
                  !dominanceMap.get(c.id)?.dominates.length,
              }"
            >
              <td class="py-2 pr-4">{{ idx + 1 }}</td>
              <td class="py-2 pr-4">
                <input v-model.trim="c.nombre" class="hc-input w-44" />
              </td>
              <td class="py-2 pr-4 text-right">
                <input
                  v-model.number="c.base"
                  type="number"
                  class="hc-input w-24 text-right"
                />
              </td>
              <td class="py-2 pr-4 text-right">
                <input
                  v-model.number="c.mod"
                  type="number"
                  class="hc-input w-24 text-right"
                />
              </td>
              <td class="py-2 pr-4 text-right font-semibold tabular-nums">
                {{ c.final }}
              </td>
              <td class="py-2 pr-4">
                <div class="flex flex-col gap-1">
                  <template v-if="dominanceMap.get(c.id)?.dominates.length">
                    <span
                      v-for="d in dominanceMap.get(c.id).dominates"
                      :key="d.otherId"
                      class="badge badge-win"
                      :title="`${c.nombre} supera a ${findName(
                        d.otherId
                      )} por ${d.diff}`"
                      >Gana a {{ findName(d.otherId) }} (+{{ d.diff }})</span
                    >
                  </template>
                  <template v-else>
                    <span class="text-xs opacity-60">—</span>
                  </template>
                  <template v-if="dominanceMap.get(c.id)?.dominatedBy.length">
                    <span
                      v-for="d in dominanceMap.get(c.id).dominatedBy"
                      :key="d.otherId + '-by'"
                      class="badge badge-lose"
                      :title="`${findName(d.otherId)} supera a ${
                        c.nombre
                      } por ${d.diff}`"
                      >Pierde vs {{ findName(d.otherId) }} (-{{ d.diff }})</span
                    >
                  </template>
                </div>
              </td>
              <td class="py-2 pr-4">
                <div class="space-y-1 text-xs">
                  <div v-if="c.lastRoll">
                    <div>
                      <span class="font-semibold">Cadena:</span>
                      {{ c.lastRoll.rolls.join(" → ") }}
                    </div>
                    <div>
                      <span class="font-semibold">Suma:</span> +{{
                        c.lastRoll.add
                      }}
                      <span v-if="c.lastRoll.sub">
                        / <span class="font-semibold">Resta:</span> -{{
                          c.lastRoll.sub
                        }}</span
                      >
                    </div>
                  </div>
                  <div v-else class="opacity-60">—</div>
                </div>
              </td>
              <td class="py-2 pr-4">
                <div class="flex flex-wrap gap-2">
                  <button class="hc-btn-sm" @click="rollForCharacter(c)">
                    Tirar
                  </button>
                  <button class="hc-btn-sm" @click="removeCharacter(c.id)">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Add Character (collapsible at bottom) -->
    <section class="hc-card">
      <button
        class="hc-accordion"
        @click="showAdder = !showAdder"
        :aria-expanded="showAdder.toString()"
      >
        <span class="font-semibold">Añadir personaje</span>
        <span class="chev" :class="{ open: showAdder }">▾</span>
      </button>
      <transition name="fade-slide">
        <form
          v-if="showAdder"
          @submit.prevent="addCharacter"
          class="grid grid-cols-1 md:grid-cols-6 gap-3 items-end mt-3"
        >
          <div class="md:col-span-2">
            <label class="block text-sm font-medium">Nombre</label>
            <input
              v-model.trim="newChar.nombre"
              type="text"
              class="hc-input w-full"
              placeholder="Nombre"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium">Base</label>
            <input
              v-model.number="newChar.base"
              type="number"
              class="hc-input w-full"
              placeholder="0"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium">Mod</label>
            <input
              v-model.number="newChar.mod"
              type="number"
              class="hc-input w-full"
              placeholder="0"
            />
          </div>
          <div class="md:col-span-2 flex gap-2">
            <button type="submit" class="hc-btn">Añadir</button>
            <button type="button" class="hc-btn" @click="addAndRoll">
              Añadir + Tirar
            </button>
          </div>
        </form>
      </transition>
    </section>

    <!-- Log -->
    <section class="hc-card space-y-2">
      <div class="flex items-center justify-between">
        <h2 class="font-semibold">Registro de tiradas</h2>
        <div class="flex gap-2 items-center">
          <small class="opacity-80">{{ logs.length }} evento(s)</small>
          <button class="hc-btn-sm" @click="clearLogs">Limpiar log</button>
        </div>
      </div>
      <div v-if="logs.length === 0" class="text-sm opacity-80">
        Sin registros todavía.
      </div>
      <ul v-else class="space-y-3 max-h-96 overflow-auto pr-2">
        <li v-for="(entry, i) in logs" :key="i" class="hc-log-item">
          <div class="text-xs opacity-80 mb-1">
            {{ formatDate(entry.time) }}
          </div>
          <div class="text-sm">
            <div class="font-semibold mb-1">{{ entry.title }}</div>
            <ul class="list-disc ml-5 space-y-1">
              <li v-for="(line, j) in entry.lines" :key="j" class="break-words">
                {{ line }}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from "vue";
import defaultCharacters from "../../dataBase/initiative/characters.json";

/** @typedef {{ id:number, nombre:string, base:number, mod:number, final:number, lastRoll: null | { add:number, sub:number, rolls:string[] } }} Character */

const nextId = ref(1);
const characters = reactive(/** @type {Character[]} */ ([]));
const logs = reactive([]);

const newChar = reactive({ nombre: "", base: 0, mod: 0 });
const showAdder = ref(false);

const d100 = () => Math.floor(Math.random() * 100) + 1;

function rollOpen() {
  const chain = [];
  let add = 0;
  let sub = 0;

  while (true) {
    const r = d100();
    chain.push(r);

    if (r <= 3) {
      const r2 = d100();
      chain.push(-r2);
      sub += r2;
      break;
    }

    if (r >= 90) {
      add += r;
      continue;
    }

    add += r;
    break;
  }

  const rolls = chain.map((n) => (n < 0 ? `-${Math.abs(n)}` : `${n}`));
  return { add, sub, rolls };
}

function computeFinal(c) {
  const { add = 0, sub = 0 } = c.lastRoll || { add: 0, sub: 0 };
  c.final = Number(c.base || 0) + Number(c.mod || 0) + add - sub;
}

function addCharacter() {
  const nombre = newChar.nombre?.trim();
  if (!nombre) return;

  const c = {
    id: nextId.value++,
    nombre,
    base: Number(newChar.base || 0),
    mod: Number(newChar.mod || 0),
    final: Number(newChar.base || 0) + Number(newChar.mod || 0),
    lastRoll: null,
  };
  characters.push(c);
  newChar.nombre = "";
  newChar.base = 0;
  newChar.mod = 0;
}

function addAndRoll() {
  addCharacter();
  const c = characters[characters.length - 1];
  if (c) rollForCharacter(c);
}

function removeCharacter(id) {
  const idx = characters.findIndex((c) => c.id === id);
  if (idx !== -1) characters.splice(idx, 1);
}

function rollForCharacter(c) {
  const last = rollOpen();
  c.lastRoll = last;
  computeFinal(c);
  const line = `${c.nombre}: Base ${c.base} + Mod ${c.mod} + [${last.rolls.join(
    " → "
  )}] = ${c.final}`;
  pushLog({ title: "Tirada individual", lines: [line] });
}

function rollAll() {
  const lines = [];
  characters.forEach((c) => {
    const last = rollOpen();
    c.lastRoll = last;
    computeFinal(c);
    lines.push(
      `${c.nombre}: Base ${c.base} + Mod ${c.mod} + [${last.rolls.join(
        " → "
      )}] = ${c.final}`
    );
  });
  if (lines.length) pushLog({ title: "Tirada masiva", lines });
}

function clearLogs() {
  logs.splice(0, logs.length);
}

function pushLog(entry) {
  logs.unshift({ ...entry, time: new Date() });
}

const sortedCharacters = computed(() => {
  return [...characters].sort((a, b) => (b.final ?? 0) - (a.final ?? 0));
});

// Dominancia: diferencias >= 150
const dominanceMap = computed(() => {
  /** @type {Map<number,{dominates:{otherId:number,diff:number}[], dominatedBy:{otherId:number,diff:number}[]}>} */
  const map = new Map();
  const list = [...characters];
  list.forEach((a) => map.set(a.id, { dominates: [], dominatedBy: [] }));
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length; j++) {
      if (i === j) continue;
      const a = list[i];
      const b = list[j];
      const diff = Number(a.final || 0) - Number(b.final || 0);
      if (diff >= 150) {
        map.get(a.id).dominates.push({ otherId: b.id, diff });
        map.get(b.id).dominatedBy.push({ otherId: a.id, diff });
      }
    }
  }
  return map;
});

function findName(id) {
  return characters.find((x) => x.id === id)?.nombre ?? `#${id}`;
}

function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleString();
}

// Siempre cargar personajes por defecto desde el JSON
onMounted(() => {
  if (defaultCharacters && Array.isArray(defaultCharacters)) {
    characters.splice(0, characters.length);
    defaultCharacters.forEach((dc) => {
      const c = {
        id: nextId.value++,
        nombre: dc.nombre,
        base: Number(dc.base || 0),
        mod: Number(dc.mod || 0),
        final: Number(dc.base || 0) + Number(dc.mod || 0),
        lastRoll: null,
      };
      characters.push(c);
    });
  }
});
</script>

<style scoped>
/* ===== High-Contrast (HC) Theme ===== */
.hc-theme {
  --hc-bg: #0b0f14;
  --hc-surface: #111826;
  --hc-surface-2: #0f1420;
  --hc-text: #e8edf7;
  --hc-muted: #9fb1c7;
  --hc-accent: #7dd3fc; /* sky-300 */
  --hc-accent-2: #60a5fa; /* blue-400 */
  --hc-danger: #f87171;
  --hc-win: #34d399; /* emerald-400 */
  --hc-lose: #fb7185; /* rose-400 */
  color: var(--hc-text);
  background: linear-gradient(180deg, #0b0f14 0%, #0a0f1a 100%);
}

.hc-card {
  background: radial-gradient(
    120% 120% at 0% 0%,
    var(--hc-surface) 0%,
    var(--hc-surface-2) 100%
  );
  border: 1px solid rgba(125, 211, 252, 0.2);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.hc-btn,
.hc-btn-sm {
  background: linear-gradient(
    180deg,
    var(--hc-accent) 0%,
    var(--hc-accent-2) 100%
  );
  color: #071018;
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 600;
  box-shadow: 0 6px 18px rgba(96, 165, 250, 0.35);
  transition: transform 0.08s ease, box-shadow 0.2s ease, filter 0.2s ease;
}
.hc-btn:hover,
.hc-btn-sm:hover {
  filter: brightness(1.05);
}
.hc-btn:active,
.hc-btn-sm:active {
  transform: translateY(1px);
}
.hc-btn-sm {
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 10px;
}

.hc-input {
  background: #0a1220;
  border: 1px solid rgba(125, 211, 252, 0.25);
  border-radius: 10px;
  padding: 6px 10px;
  color: var(--hc-text);
  outline: none;
}
.hc-input:focus {
  box-shadow: 0 0 0 3px rgba(125, 211, 252, 0.25);
}

.hc-table {
  border-collapse: separate;
  border-spacing: 0 10px;
}
.hc-table thead th {
  position: sticky;
  top: 0;
  background: var(--hc-surface);
  z-index: 1;
  color: var(--hc-muted);
  font-weight: 600;
}
.hc-table tbody tr {
  background: rgba(17, 24, 39, 0.6);
}
.hc-table tbody tr:hover {
  background: rgba(17, 24, 39, 0.85);
}
.hc-table tbody td {
  border-top: 1px solid rgba(125, 211, 252, 0.18);
  border-bottom: 1px solid rgba(125, 211, 252, 0.18);
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

/* Dominance highlighting */
.edge-win {
  outline: 2px solid rgba(52, 211, 153, 0.35);
}
.edge-lose {
  outline: 2px solid rgba(251, 113, 133, 0.35);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: max-content;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2px;
}
.badge-win {
  background: rgba(52, 211, 153, 0.15);
  color: var(--hc-win);
  border: 1px solid rgba(52, 211, 153, 0.35);
}
.badge-lose {
  background: rgba(251, 113, 133, 0.12);
  color: var(--hc-lose);
  border: 1px solid rgba(251, 113, 133, 0.35);
}

/* Accordion */
.hc-accordion {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border: 1px dashed rgba(125, 211, 252, 0.35);
  border-radius: 12px;
  padding: 10px 12px;
}
.hc-accordion .chev {
  transition: transform 0.2s ease;
}
.hc-accordion .chev.open {
  transform: rotate(180deg);
}

/* Logs */
.hc-log-item {
  border: 1px solid rgba(125, 211, 252, 0.18);
  border-radius: 12px;
  padding: 12px;
  background: rgba(10, 18, 32, 0.6);
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.18s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
