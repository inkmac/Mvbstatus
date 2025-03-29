import { createApp } from 'vue'
import App from '@renderer/App.vue'
import {createPinia} from "pinia";
import 'element-plus/dist/index.css';

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
