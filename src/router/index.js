import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        // components: {
        //     default: () => import('@/views/Home.vue'),
        //     navbar: () => import('@/components/Navbar.vue')
        // }
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
    // user
    {
        path: '/dashboard',
        name: 'Dashboard',
        components: {
            default: () => import('@/views/user/Dashboard.vue'),
            navbar: () => import('@/components/Navbar.vue')
        },
        props: {
            default: true
        }
    },
    {
        path: '/profile',
        name: 'Profile',
        components: {
            default: () => import('@/views/user/Profile.vue'),
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
    routes,
    linkExactActiveClass: 'active exact-active',
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            // return {
            //     x: 0,
            //     y: 0
            // }
            window.scrollTo(0, 0)
        }
    }
})

export default router
