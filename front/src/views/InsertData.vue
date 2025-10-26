<template>
  <article>
    <section>
      <div class="flex">
        <span class="separate">Título del artículo</span>
        <input class="title" type="text" v-model="postTitle">
      </div>
      <div class="flex">
        <span class="separate">Juego de origen</span>
        <input class="title" type="text" v-model="titleOrigin">
      </div>
    </section>
    <section>
      <p class="fill-web-page">
        <CKEditor class="min-height" :editor="editor" v-model="articleText" :config="editorConfig"
          aria-placeholder="Escribe aquí tu artículo"></ckeditor>
      </p>
      <p class="fill-web-page">
        <CKEditor class="min-height" :editor="editor" v-model="articleDescription" :config="editorConfig"
          aria-placeholder="Escribe aquí tu artículo"></ckeditor>
      </p>
      <section class="flex-vertical">
        <p>Input image</p>
        <input type="file" @change="handleFileChange">
        <button @click="browseFiles">Examinar archivos en el servidor</button>
        <label v-if="hasImages" for="imgNames">Choose a img:</label>

        <select v-if="hasImages" name="images" id="images" @change="assignImage($event.target.selectedIndex)">
          <option v-for="name in cleanFileList">{{ name }}</option>
        </select>

      </section>
    </section>
    <section class="flex-vertical">
      <p>Cargar por ID</p>
      <input class="tiny" type="number" v-model="searchById" @change="showArticle">
      <br>
      <p>Cargar por nombre de artículo</p>
      <input class="tiny" type="text" v-model="searchByTitle" @change="showArticle">
      <button @click="saveArticle">Save me on data base!</button>
    </section>
  </article>
</template>


<script setup>
import { ref } from 'vue';
import { publisherStore } from '@/store/PublisherStore';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { component as CKEditor } from '@ckeditor/ckeditor5-vue'
import axios from "axios";

const editor = ClassicEditor;

const editorConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      '|',
      'imageUpload',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      'undo',
      'redo',
    ]
  },
  language: 'es',
  image: {
    toolbar: [
      'imageTextAlternative',
      'toggleImageCaption',
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side'
    ]
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells'
    ]
  },
};

const publisher = publisherStore();
const postTitle = ref('');
const titleOrigin = ref('Cosmos Rol');
const articleText = ref('');
const articleDescription = ref('');
const imageURL = ref('');
const searchById = ref(null);
const searchByTitle = ref('');
const hasArticle = ref(false);
const articleLoaded = ref(null);
const fileList = ref([]);
const cleanFileList = ref([]);
const hasImages = ref(false);

const updatearticleText = (data) => {
  articleText.value = data;
}

const saveArticle = async () => {
  if (hasArticle.value) {
    publisher.updateArticle(articleLoaded.value.id, postTitle.value, "COSMOSROL", articleText.value, articleDescription.value, imageURL.value);
    alert('Artículo actualizado');
  } else {
    await publisher.saveArticle(postTitle.value, "COSMOSROL", articleText.value, null, null, articleDescription.value);
    alert('Artículo guardado');
  }
}

async function handleFileChange(event) {
  try {
    const file = event.target.files[0];

    // Crea un objeto FormData para enviar el archivo al servidor
    const formData = new FormData();
    formData.append("file", file);

    // Realiza la solicitud POST al servidor para cargar el archivo
    const response = await axios.post(
      "http://79.145.17.100:8080/file/save",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Importante establecer la cabecera adecuada para enviar archivos
        },
      }
    );

    // Aquí puedes hacer algo con la URL de acceso que devuelva el servidor
    imageURL.value = response.data;
  } catch (error) {
    console.error("Error al cargar el archivo:", error);
    // Maneja el error de manera adecuada según tus necesidades
  }
}

async function showArticle() {
  if (searchById.value > 0) {
    const article = await publisher.getArticleById(searchById.value);
    postTitle.value = article.title;
    articleText.value = article.articleText;
    articleDescription.value = article.description;
    imageURL.value = article.headerImg;
    hasArticle.value = true;
    articleLoaded.value = article;
  } else if (searchByTitle.value.length > 0) {
    const article = await publisher.getArticleByTitle(searchByTitle.value);
    postTitle.value = article.title;
    articleText.value = article.articleText;
    articleDescription.value = article.description;
    imageURL.value = article.headerImg;
    hasArticle.value = true;
    articleLoaded.value = article;
  }
}

const browseFiles = async () => {
  hasImages.value = !hasImages.value;
  try {
    const response = await axios.get("http://79.145.17.100:8080/files/lookfor");
    fileList.value = response.data;
    cleanFileList.value = cleanNames(fileList.value);
  } catch (error) {
    console.error("Error al obtener la lista de archivos:", error);
  }
};

function cleanNames(nameList) {
  let cleanedList = [...nameList];
  cleanedList.forEach((name, index) => {
    let newName = name.split("_");
    cleanedList[index] = newName[0];
  });
  cleanedList.unshift("");
  return cleanedList;
}

function assignImage(index) {
  index--;
  imageURL.value = publisher.SERVER + fileList.value[index];
}

</script>

<style scoped>
.flex-vertical {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.flex-vertical input {
  width: 50%;
}

.title {
  width: 50%;
}

.flex {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.separate {
  margin-right: 15px;
}

.tiny {
  width: 50%;
}
</style>