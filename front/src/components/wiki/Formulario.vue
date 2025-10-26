<template>
  <!-- En este componente vamos a aprender data-binding, v-model, v-for y, en esencia, mucha reactividad. -->
  <div id="formulario-contacto">
    <p>Nombre</p>
    <!-- Usamos el v-model para darle funcionalidad a elementos de html. Es decir, añadir cierta lógica al HTML
    En este caso yo le doy un nombre que lo referencie a data(), lo que hace que el v-model ya entienda que sea lo que sea lo que haya en ese html, tiene que meterlo en la variable con el mismo nombre -->
    <input type="text" name="nombre" id="1" class="contacto" v-model="nombre" />
    <p>Apellidos</p>
    <input
      type="text"
      name="apellidos"
      id="2"
      class="contacto"
      v-model="apellidos"
    />
    <p>Correo</p>
    <!-- Acuérdate que cada input tiene un tipo predeterminado. Esto es lo que hace que, cuando pinches en un input, te aparezca directamente para rellenar con tu nombre, tu número de teléfono, tu e-mail... es muy cómodo y los usuarios se enfadan si no lo programas bien. https://www.w3schools.com/html/html_form_input_types.asp aquí encontrarás más información al respecto-->
    <input type="email" name="email" id="3" class="contacto" v-model="email" />
    <p>Mensaje</p>
    <input
      type="text"
      name="mensaje"
      id="4"
      class="contacto"
      v-model="mensaje"
    />
    <!-- El siguiente mensaje solo se mostrará si se han introducido nombre, apellidos e e-mail -->
    <p v-if="nombre && apellidos && email">
      Te llamas {{ nombre }} {{ apellidos }}, tu correo es {{ email }} y tienes
      <span v-if="mensaje && edad <= 17"
        >que pedir permiso paterno antes de ponerte en contacto con
        nosotros</span
      >
      <span v-else-if="mensaje && edad > 17"> que decirnos que: </span>
      <span v-else>¡Aún no tienes nada que decir!</span>
    </p>
    <p>{{ mensaje }}</p>
    <div>
      <!-- A continuación vamos a ver cómo se hacen condicionales dentro de vue. Lo veremos simplemente cogiendo la edad y, si la variable existe lo vamos a decir, si tiene entre 18 y 20 años pondremos un mensaje y para mayores de 20 pondremos otro -->
      <input type="number" name="edad" id="4" class="contacto" v-model="edad" />
      <!-- En la línea de abajo simplemente comprobamos si la variable edad existe. -->
      <p v-if="edad">Existe la variable edad y su valor es {{ edad }}</p>
      <!-- El bloque de abajo ya es un if anidado. -->
      <p v-if="edad >= 20">Eres mayor de edad</p>
      <p v-else-if="edad >= 18 && edad <= 20">
        Eres mayor de edad pero tampoco mucho
      </p>
      <p v-else>No eres mayor de edad</p>
      <!-- Para más información sobre clases condicionales, usando el v-bind, puedes ir al componente GreatBlock que tiene un código añadido usando el v-bind condicional -->
    </div>
    <button @click="consoleaEsto()">¡Envía tu mensaje!</button>
  </div>
</template>

<script>
//Para poder recoger datos, tengo que tener una estructura data() que me permita recoger dichos datos.
export default {
  //El nombre que tendrá este export, para luego poder acceder a él sin problemas.
  name: "Formulario",
  data() {
    //Acuérdate de ponerle el return. El data siempre devuelve algún dato y a ese "devolver" se le llama return aquí.
    return {
      nombre: "",
      apellidos: "",
      email: "",
      mensaje: "",
      //Cuando asignamos un valor, como en el caso de la edad, lo que decimos es que ese será el valor por defecto.
      edad: 18,
    };
  },
  methods: {
    consoleaEsto() {
      console.log(
        "Tu mensaje era: " +
          this.nombre +
          "\n" +
          this.apellidos +
          "\n" +
          this.email +
          "\n" +
          this.mensaje
      );
    },
  },
};
</script>

<style>
#formulario-contacto .contacto {
  max-width: 30%;
  height: 19px;
}
</style>
