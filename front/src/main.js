import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "@fontsource/merriweather";

import CKEditor from "@ckeditor/ckeditor5-vue";

const pinia = createPinia();

createApp(App).use(router).use(pinia).use(CKEditor).mount("#app");
