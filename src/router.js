import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Profile from "./views/Profile.vue";

import firebase from 'firebase/app';
import 'firebase/auth';

Vue.use(Router);

const router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "home",
            component: Home
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
            path: "/profile",
            name: "profile",
            component: Profile,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/recipe/:recipe_key",
            name: "view-recipe",
            props: true,
            // route level code-splitting
            // this generates a separate chunk (view-recipe.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
            import(/* webpackChunkName: "view-recipe" */ "./views/recipe/View.vue")
        },
        {
            path: "/create",
            name: "create-recipe",
            meta: {
                requiresAuth: true
            },
            // route level code-splitting
            // this generates a separate chunk (create-recipe.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
            import(/* webpackChunkName: "create-recipe" */ "./views/recipe/Create.vue")
        },
        {
            path: "/recipe/:recipe_key/edit",
            name: "edit-recipe",
            props: true,
            meta: {
                requiresAuth: true
            },
            // route level code-splitting
            // this generates a separate chunk (create-recipe.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
            import(/* webpackChunkName: "create-recipe" */ "./views/recipe/Edit.vue")
        }
    ]
});

router.beforeEach((to, from, next) => {
    const currentUser = firebase.auth().currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if(requiresAuth && !currentUser) {
        next({
            // requires auth and user is not logged in
            path: '/login',
            query: {
                redirect: to.fullPath
            }
        })
    }
    else if(!requiresAuth) {
        next();
    } else {
        next();
    }
});

export default router;
