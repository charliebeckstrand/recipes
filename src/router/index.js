import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
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
        path: '/recipes',
        name: 'Recipes',
        components: {
            default: () => import('@/views/Recipes.vue'),
            navbar: () => import('@/components/Navbar.vue')
        }
    },
    // {
    //     path: '/recipes/create',
    //     name: 'CreateRecipe',
    //     components: {
    //         default: () => import('@/views/recipes/Create.vue'),
    //         navbar: () => import('@/components/Navbar.vue')
    //     },
    //     props: {
    //         default: true
    //     }
    // },
    // {
    //     path: '/recipes/:recipe_id/:recipe_name/edit',
    //     name: 'EditRecipe',
    //     components: {
    //         default: () => import('@/views/recipe/Edit.vue'),
    //         navbar: () => import('@/components/Navbar.vue')
    //     },
    //     props: {
    //         default: true
    //     }
    // },
    {
        path: '/recipes/:recipe_id/:recipe_name',
        name: 'Recipe',
        components: {
            default: () => import('@/views/recipe/Index.vue'),
            navbar: () => import('@/components/Navbar.vue')
        },
        props: {
            default: true
        }
    },
    // user
    {
        path: '/dashboard',
        name: 'UserDashboard',
        redirect: '/dashboard/my-recipes',
        children: [
            {
                path: '/dashboard/my-recipes',
                components: {
                    default: () => import('@/views/user/dashboard/MyRecipes.vue'),
                    navbar: () => import('@/components/Navbar.vue')
                },
            }
        ],
        components: {
            default: () => import('@/views/user/dashboard/Index.vue'),
            navbar: () => import('@/components/Navbar.vue')
        },
        props: {
            default: true
        }
    },
    {
        path: '/profile',
        name: 'UserProfile',
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
