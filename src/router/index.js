import Vue from 'vue'
import VueRouter from 'vue-router'

// import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        redirect: '/recipes'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/recipes',
        name: 'Recipes',
        components: {
            default: () => import('@/views/Recipes.vue'),
            navbar: () => import('@/components/Navbar.vue')
        }
    },
    {
        path: '/recipes/:recipe_key/:url',
        name: 'Recipe',
        components: {
            default: () => import('@/views/Recipe.vue'),
            navbar: () => import('@/components/Navbar.vue')
        },
        props: {
            default: true
        }
    },
    {
        path: '/recipes/create',
        name: 'CreateRecipe',
        components: {
            default: () => import('@/views/CreateRecipe.vue'),
            navbar: () => import('@/components/Navbar.vue')
        },
        props: {
            default: true
        }
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
