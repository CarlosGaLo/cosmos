# Character Store V2

## 📁 Estructura

```
stores/
├── characterState.js    # Estado reactivo puro
├── characterActions.js  # Lógica de mutación
├── index.js            # Composición final
└── README.md           # Esta documentación
```

## 🎯 Filosofía

### Separación de Responsabilidades

- **State**: Solo refs y computed, sin lógica
- **Actions**: Orquesta servicios, no contiene cálculos
- **Services**: Funciones puras con lógica de negocio

### Flujo de Datos

```
Componente → Action → Service → State → Computed → Componente
```

## 📝 Uso Básico

### Importar Store

```javascript
import { useCharacterStore } from "@/modules/character/stores";

const characterStore = useCharacterStore();
```

### Acceder al Estado

```javascript
// Reactivo
const name = characterStore.character.name;
const freeXP = characterStore.metaData.freeXP;

// Computed
const totalXP = characterStore.totalXP;
const hasMagic = characterStore.hasMagicAccess;
```

### Modificar Estado

```javascript
// SIEMPRE usar acciones, NUNCA mutar directamente
characterStore.setBasicInfo({
  name: "Aragorn",
  age: 87,
  ageState: "Adulto",
  sex: "Masculino",
});

// Incrementar campo
characterStore.increaseCampBase("mov", 1);

// Cargar especie
characterStore.loadSpecieTemplate("humano", "Masculino");
```

## 🔒 Reglas

1. **NUNCA** mutes `state.something.value` directamente desde componentes
2. **SIEMPRE** usa acciones para modificaciones
3. **VALIDA** antes de mutar (las acciones lo hacen automáticamente)
4. **RECALCULA** después de cambios (las acciones lo hacen automáticamente)

## 🧪 Testing

```javascript
import { useCharacterState } from "./characterState";
import { useCharacterActions } from "./characterActions";

const state = useCharacterState();
const actions = useCharacterActions(state);

// Test
actions.increaseCampBase("mov", 1);
expect(state.character.value.camp.mov.base).toBe(1);
```

## 🚀 Migración desde Store Legacy

### Antes

```javascript
import { characterFunctions } from "@/store/characterSheet";
const char = characterFunctions();
char.calculateXP(1, 0, 0, 0);
```

### Después

```javascript
import { useCharacterStore } from "@/modules/character/stores";
const char = useCharacterStore();
char.increaseCampBase("mov", 1);
```
