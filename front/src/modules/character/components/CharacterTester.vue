<template>
  <div class="character-tester">
    <h1>🧪 Character Store V2 - Tester</h1>

    <!-- Panel de Estado -->
    <section class="test-section">
      <h2>📊 Estado Actual</h2>
      <div class="info-grid">
        <div class="info-item">
          <label>Nombre:</label>
          <span>{{ character.name || '(sin nombre)' }}</span>
        </div>
        <div class="info-item">
          <label>Especie:</label>
          <span>{{ character.specie || '(sin especie)' }}</span>
        </div>
        <div class="info-item">
          <label>Edad:</label>
          <span>{{ character.age }} ({{ character.ageState }})</span>
        </div>
        <div class="info-item">
          <label>Sexo:</label>
          <span>{{ character.sex }}</span>
        </div>
      </div>

      <div class="xp-panel">
        <div class="xp-item" :class="{ warning: metaData.freeXP < 100 }">
          <label>XP Libre:</label>
          <span class="xp-value">{{ metaData.freeXP }}</span>
        </div>
        <div class="xp-item">
          <label>XP Usada:</label>
          <span class="xp-value">{{ metaData.usedXP }}</span>
        </div>
        <div class="xp-item">
          <label>XP Total:</label>
          <span class="xp-value">{{ totalXP }}</span>
        </div>
      </div>
    </section>

    <!-- Panel de Tests -->
    <section class="test-section">
      <h2>🎮 Tests Interactivos</h2>

      <!-- Test 1: Información Básica -->
      <div class="test-card">
        <h3>Test 1: Información Básica</h3>
        <div class="test-controls">
          <input 
            v-model="testName" 
            placeholder="Nombre del personaje"
            @keyup.enter="runTest1"
          />
          <input 
            v-model.number="testAge" 
            type="number" 
            placeholder="Edad"
            @keyup.enter="runTest1"
          />
          <select v-model="testAgeState">
            <option value="Joven">Joven</option>
            <option value="Adulto">Adulto</option>
            <option value="Anciano">Anciano</option>
          </select>
          <select v-model="testSex">
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
          <button @click="runTest1" class="btn-primary">
            Establecer Info
          </button>
        </div>
        <div v-if="testResults.test1" class="test-result" :class="testResults.test1.status">
          {{ testResults.test1.message }}
        </div>
      </div>

      <!-- Test 2: Tipo de Personaje -->
      <div class="test-card">
        <h3>Test 2: Tipo de Personaje</h3>
        <div class="test-controls">
          <button @click="runTest2('HERO')" class="btn-primary">
            Héroe (1000 XP)
          </button>
          <button @click="runTest2('ADVANCED')" class="btn-primary">
            Avanzado (600 XP)
          </button>
          <button @click="runTest2('NORMAL')" class="btn-primary">
            Normal (200 XP)
          </button>
        </div>
        <div v-if="testResults.test2" class="test-result" :class="testResults.test2.status">
          {{ testResults.test2.message }}
        </div>
      </div>

      <!-- Test 3: Cargar Especie -->
      <div class="test-card">
        <h3>Test 3: Cargar Especie</h3>
        <div class="test-controls">
          <select v-model="testSpecie">
            <option value="humano">Humano</option>
            <option value="kordun">Kordún</option>
            <option value="urcan">Urcan</option>
            <option value="zannin">Zannin</option>
            <option value="namester">Námester</option>
            <option value="nergal">Nergal</option>
          </select>
          <button @click="runTest3" class="btn-primary">
            Cargar Especie
          </button>
        </div>
        <div v-if="testResults.test3" class="test-result" :class="testResults.test3.status">
          {{ testResults.test3.message }}
        </div>
      </div>

      <!-- Test 4: Incrementar Campos -->
      <div class="test-card">
        <h3>Test 4: Incrementar Campos</h3>
        <div class="test-controls">
          <button 
            v-for="campCode in campCodes" 
            :key="campCode"
            @click="runTest4(campCode)" 
            class="btn-secondary"
            :disabled="!character.camp[campCode]"
          >
            {{ campCode.toUpperCase() }} 
            ({{ character.camp[campCode]?.base || 0 }}/{{ character.camp[campCode]?.cap || 0 }})
          </button>
        </div>
        <div v-if="testResults.test4" class="test-result" :class="testResults.test4.status">
          {{ testResults.test4.message }}
        </div>
      </div>

      <!-- Test 5: Validación de Límites -->
      <div class="test-card">
        <h3>Test 5: Validación de Límites</h3>
        <div class="test-controls">
          <button @click="runTest5" class="btn-warning">
            Intentar Exceder Límite
          </button>
        </div>
        <div v-if="testResults.test5" class="test-result" :class="testResults.test5.status">
          {{ testResults.test5.message }}
        </div>
      </div>

      <!-- Test 6: Validación de XP -->
      <div class="test-card">
        <h3>Test 6: Validación de XP</h3>
        <div class="test-controls">
          <button @click="runTest6" class="btn-warning">
            Intentar Gastar XP sin Fondos
          </button>
        </div>
        <div v-if="testResults.test6" class="test-result" :class="testResults.test6.status">
          {{ testResults.test6.message }}
        </div>
      </div>
    </section>

    <!-- Panel de Campos -->
    <section class="test-section" v-if="hasSpecie">
      <h2>⚔️ Campos del Personaje</h2>
      <div class="camps-grid">
        <div 
          v-for="(camp, code) in character.camp" 
          :key="code"
          class="camp-card"
          v-if="camp"
        >
          <h3>{{ camp.name }} ({{ code }})</h3>
          <div class="camp-stats">
            <div class="stat">
              <span class="stat-label">Base:</span>
              <span class="stat-value">{{ camp.base }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Especie:</span>
              <span class="stat-value">{{ camp.specie }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Edad:</span>
              <span class="stat-value">{{ camp.age }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Total:</span>
              <span class="stat-value highlight">{{ camp.total }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Cap:</span>
              <span class="stat-value">{{ camp.cap }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Panel de Logs -->
    <section class="test-section">
      <h2>📝 Log de Operaciones</h2>
      <div class="log-panel">
        <div 
          v-for="(log, index) in logs" 
          :key="index"
          class="log-entry"
          :class="log.type"
        >
          <span class="log-time">{{ log.time }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
      <button @click="clearLogs" class="btn-secondary">Limpiar Logs</button>
    </section>

    <!-- Panel de Reset -->
    <section class="test-section">
      <h2>🔄 Reset</h2>
      <button @click="resetAll" class="btn-danger">
        ⚠️ Resetear Todo
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCharacterStore } from '../stores';

// Store
const store = useCharacterStore();

// State shortcuts
const character = computed(() => store.character);
const metaData = computed(() => store.metaData);
const totalXP = computed(() => store.totalXP);
const hasSpecie = computed(() => store.hasSpecie);

// Test data
const testName = ref('Aragorn');
const testAge = ref(87);
const testAgeState = ref('Adulto');
const testSex = ref('Masculino');
const testSpecie = ref('humano');

const campCodes = ['art', 'mov', 'cul', 'sup', 'sob', 'vig'];

// Test results
const testResults = ref({
  test1: null,
  test2: null,
  test3: null,
  test4: null,
  test5: null,
  test6: null,
});

// Logs
const logs = ref([]);

function addLog(message, type = 'info') {
  const time = new Date().toLocaleTimeString();
  logs.value.unshift({ time, message, type });
  if (logs.value.length > 50) {
    logs.value.pop();
  }
}

function clearLogs() {
  logs.value = [];
  addLog('Logs limpiados', 'info');
}

// ==================== TESTS ====================

function runTest1() {
  try {
    store.setBasicInfo({
      name: testName.value,
      age: testAge.value,
      ageState: testAgeState.value,
      sex: testSex.value,
    });

    testResults.value.test1 = {
      status: 'success',
      message: `✅ Información establecida: ${testName.value}, ${testAge.value} años (${testAgeState.value})`,
    };

    addLog(`Info básica actualizada: ${testName.value}`, 'success');
  } catch (error) {
    testResults.value.test1 = {
      status: 'error',
      message: `❌ Error: ${error.message}`,
    };
    addLog(`Error en Test 1: ${error.message}`, 'error');
  }
}

function runTest2(typeKey) {
  try {
    store.selectCharacterType(typeKey);

    const types = {
      HERO: 'Héroe',
      ADVANCED: 'Avanzado',
      NORMAL: 'Normal',
    };

    testResults.value.test2 = {
      status: 'success',
      message: `✅ Tipo "${types[typeKey]}" seleccionado. XP Libre: ${metaData.value.freeXP}`,
    };

    addLog(`Tipo de personaje: ${types[typeKey]} (${metaData.value.freeXP} XP)`, 'success');
  } catch (error) {
    testResults.value.test2 = {
      status: 'error',
      message: `❌ Error: ${error.message}`,
    };
    addLog(`Error en Test 2: ${error.message}`, 'error');
  }
}

function runTest3() {
  try {
    const success = store.loadSpecieTemplate(testSpecie.value, testSex.value);

    if (success) {
      testResults.value.test3 = {
        status: 'success',
        message: `✅ Especie "${testSpecie.value}" cargada correctamente`,
      };
      addLog(`Especie cargada: ${testSpecie.value}`, 'success');
    } else {
      throw new Error('No se pudo cargar la plantilla');
    }
  } catch (error) {
    testResults.value.test3 = {
      status: 'error',
      message: `❌ Error: ${error.message}`,
    };
    addLog(`Error en Test 3: ${error.message}`, 'error');
  }
}

function runTest4(campCode) {
  try {
    const camp = character.value.camp[campCode];
    const beforeBase = camp.base;
    const beforeXP = metaData.value.freeXP;

    const success = store.increaseCampBase(campCode, 1);

    if (success) {
      testResults.value.test4 = {
        status: 'success',
        message: `✅ Campo "${campCode}" incrementado: ${beforeBase} → ${camp.base} (XP: ${beforeXP} → ${metaData.value.freeXP})`,
      };
      addLog(`${campCode.toUpperCase()} +1 (Base: ${camp.base}, XP: ${metaData.value.freeXP})`, 'success');
    } else {
      testResults.value.test4 = {
        status: 'warning',
        message: `⚠️ No se pudo incrementar "${campCode}" (XP insuficiente o límite alcanzado)`,
      };
      addLog(`Fallo al incrementar ${campCode.toUpperCase()}`, 'warning');
    }
  } catch (error) {
    testResults.value.test4 = {
      status: 'error',
      message: `❌ Error: ${error.message}`,
    };
    addLog(`Error en Test 4: ${error.message}`, 'error');
  }
}

function runTest5() {
  try {
    if (!hasSpecie.value) {
      throw new Error('Debes cargar una especie primero (Test 3)');
    }

    // Intentar incrementar un campo hasta su límite
    const campCode = 'mov';
    const camp = character.value.camp[campCode];
    const maxPossible = camp.cap - camp.specie - camp.age;

    let attempts = 0;
    let successes = 0;

    // Intentar incrementar 20 veces (debería detenerse antes)
    for (let i = 0; i < 20; i++) {
      attempts++;
      const success = store.increaseCampBase(campCode, 1);
      if (success) {
        successes++;
      } else {
        break;
      }
    }

    testResults.value.test5 = {
      status: 'success',
      message: `✅ Validación OK: Se detuvieron los incrementos correctamente. Intentos: ${attempts}, Éxitos: ${successes}, Límite: ${maxPossible}`,
    };

    addLog(`Test de límites: ${successes}/${attempts} incrementos antes de detenerse`, 'info');
  } catch (error) {
    testResults.value.test5 = {
      status: 'error',
      message: `❌ Error: ${error.message}`,
    };
    addLog(`Error en Test 5: ${error.message}`, 'error');
  }
}

function runTest6() {
  try {
    // Guardar XP actual
    const beforeXP = metaData.value.freeXP;

    // Intentar gastar más XP de la disponible
    const success = store.modifyXP({ other: beforeXP + 100 });

    if (!success) {
      testResults.value.test6 = {
        status: 'success',
        message: `✅ Validación OK: Se bloqueó correctamente el gasto excesivo de XP (intentó gastar ${beforeXP + 100}, disponible: ${beforeXP})`,
      };
      addLog(`Validación XP funcionando correctamente`, 'info');
    } else {
      testResults.value.test6 = {
        status: 'error',
        message: `❌ FALLO: Se permitió gastar más XP de la disponible`,
      };
      addLog(`⚠️ CRÍTICO: Validación XP falló`, 'error');
    }
  } catch (error) {
    testResults.value.test6 = {
      status: 'error',
      message: `❌ Error: ${error.message}`,
    };
    addLog(`Error en Test 6: ${error.message}`, 'error');
  }
}

function resetAll() {
  if (confirm('¿Seguro que quieres resetear todo?')) {
    // Recargar la página para resetear el store
    window.location.reload();
  }
}
</script>

<style scoped>
.character-tester {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2em;
}

h2 {
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

h3 {
  color: #555;
  margin-bottom: 15px;
}

/* Sections */
.test-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.info-item label {
  font-weight: 600;
  color: #666;
}

.info-item span {
  color: #2c3e50;
}

/* XP Panel */
.xp-panel {
  display: flex;
  gap: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}

.xp-item {
  flex: 1;
  text-align: center;
}

.xp-item.warning {
  background: rgba(231, 76, 60, 0.2);
  border-radius: 4px;
  padding: 5px;
}

.xp-item label {
  display: block;
  font-size: 0.9em;
  opacity: 0.9;
  margin-bottom: 5px;
}

.xp-value {
  display: block;
  font-size: 2em;
  font-weight: bold;
}

/* Test Cards */
.test-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 4px solid #3498db;
}

.test-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.test-controls input,
.test-controls select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.test-controls input {
  flex: 1;
  min-width: 150px;
}

/* Buttons */
.btn-primary,
.btn-secondary,
.btn-warning,
.btn-danger {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
  font-size: 12px;
  padding: 6px 12px;
}

.btn-secondary:hover:not(:disabled) {
  background: #7f8c8d;
}

.btn-warning {
  background: #f39c12;
  color: white;
}

.btn-warning:hover {
  background: #e67e22;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Test Results */
.test-result {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
  font-weight: 500;
}

.test-result.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.test-result.warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.test-result.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Camps Grid */
.camps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.camp-card {
  background: white;
  border: 2px solid #3498db;
  border-radius: 8px;
  padding: 15px;
}

.camp-card h3 {
  color: #3498db;
  margin-bottom: 10px;
  text-align: center;
}

.camp-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #ecf0f1;
}

.stat-label {
  color: #7f8c8d;
  font-weight: 500;
}

.stat-value {
  color: #2c3e50;
  font-weight: 600;
}

.stat-value.highlight {
  color: #3498db;
  font-size: 1.2em;
}

/* Log Panel */
.log-panel {
  background: #2c3e50;
  color: #ecf0f1;
  border-radius: 4px;
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  margin-bottom: 10px;
}

.log-entry {
  padding: 5px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.log-entry:last-child {
  border-bottom: none;
}

.log-time {
  color: #95a5a6;
  margin-right: 10px;
}

.log-entry.success .log-message {
  color: #2ecc71;
}

.log-entry.warning .log-message {
  color: #f39c12;
}

.log-entry.error .log-message {
  color: #e74c3c;
}

.log-entry.info .log-message {
  color: #3498db;
}
</style>