<script setup>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ref, watch, defineEmits } from 'vue';

const editorData = ref("");
const emits = defineEmits(['updateEditorData']);


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
    }
};

const updateEditorData = () => {
    const data = editorData.value;
    emits('updateEditorData', data);
}

watch(() => editorData.value, (newValue) => {
    updateEditorData(newValue);
})

const editor = ClassicEditor;

</script>


<template>
    <p class="fill-web-page">
        <ckeditor class="min-height" :editor="editor" v-model="editorData" :config="editorConfig"
            aria-placeholder="Escribe aquí tu artículo"></ckeditor>
    </p>
</template>

<style scoped>
.min-height {
    min-height: 100vh;
}
</style>