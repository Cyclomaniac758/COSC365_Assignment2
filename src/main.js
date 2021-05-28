import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router';
import App from './App.vue';
import Home from './components/Home.vue';
import Users from './components/Users.vue';
import Event from './components/Event.vue';
import axios from 'axios';
import ElementPlus from 'element-plus';




const routes = [
    {
        path: "/",
        component: Home
    },
    {
        path: "/event/:id",
        component: Event
    },
    {
        path: "/users/:id",
        component: Users
    }
];

const router = createRouter({
    routes,
    history: createWebHistory()
})

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.config.globalProperties.axios = axios
app.mount('#app')
