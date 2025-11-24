# Backlog
Pendiente habilitar CORST para el front. 

# Installation from scratch

- npm init -y
- npm install express
- npm install mongoose
- npm install -g nodemon

# If you are downloading the project

Remember to npm i :)

# To run the project type

- npm run seed -> This will set up the DB.
- nodemon src/app.js

## Estructura de reglas:

```json
{
    "sID": "test",
    "title": "Regla de Prueba",
    "content": "<p>Otra regla de prueba.</p>",
    "category": "Test",
    "subcategory": "Unitario",
    "tags": ["prueba", "test"],
    "relatedRules": ["test"]
},
```


## Habilitar SSL
openssl version
cd ~/Desktop/cosmos/back

# Generar clave privada y certificado (válido por 365 días)
openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365
