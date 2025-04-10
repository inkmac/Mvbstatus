import {createRouter, createWebHistory} from "vue-router"
import GeneralSettings from "@renderer/views/GeneralSettings.vue";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'settings',
      path: '/settings',
      children: [
        {
          name: 'settings-general',
          path: 'general',
          component: GeneralSettings
        }
      ]
    },
  ]
})

export default router
