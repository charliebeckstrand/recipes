import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";

import firebase from 'firebase';

Vue.use(Router);

const router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            redirect: "/login"
        },
        {
            path: "/login",
            name: "login",
            component: Login,
            meta: {
                requiresAuth: false
            }
        },
        {
            path: "/recipes",
            name: "recipes",
            meta: {
                requiresAuth: true
            },
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
            import(/* webpackChunkName: "about" */ "./views/Recipes.vue")
        },
        {
            path: "/recipes/create",
            name: "createRecipe",
            meta: {
                requiresAuth: true
            },
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
            import(/* webpackChunkName: "about" */ "./views/CreateRecipe.vue")
        }
    ]
});

router.beforeEach((to, from, next) => {
    const currentUser = firebase.auth().currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if(to.matched.some(record => record.meta.requiresAuth)) {
        if (!currentUser) {
            next({
                // requires auth and user is not logged in
                path: '/login',
                query: {
                    redirect: to.fullPath
                }
            })
        } else {
            // requires auth and user is logged in
            next();
        }
    } else {
        // does no require auth
        next();
    }
});

export default router;
