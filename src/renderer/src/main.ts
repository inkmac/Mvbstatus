import { createApp } from 'vue'
import App from '@renderer/App.vue'
import {createPinia} from "pinia";
import 'element-plus/dist/index.css';
import router from "@renderer/router";

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
