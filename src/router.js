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
            path: "/recipes/create",
            name: "create-recipe",
            meta: {
                requiresAuth: true
            },
            // route level code-splitting
            // this generates a separate chunk (create-recipe.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
            import(/* webpackChunkName: "create-recipe" */ "./views/recipe/Manage.vue")
        },
        {
            path: "/recipes/edit/:recipe_key",
            name: "edit-recipe",
            props: true,
            meta: {
                requiresAuth: true
            },
            // route level code-splitting
            // this generates a separate chunk (create-recipe.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
            import(/* webpackChunkName: "create-recipe" */ "./views/recipe/Manage.vue")
        },
        {
            path: "/:recipe_key",
            name: "view-recipe",
            props: true,
            // route level code-splitting
            // this generates a separate chunk (view-recipe.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
            import(/* webpackChunkName: "view-recipe" */ "./views/recipe/View.vue")
        },
    ]
});

router.beforeEach((to, from, next) => {
    const currentUser = firebase.auth().currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if(to.path == '/') {
        if(to.matched.some(record => record.meta.requiresAuth && !currentUser)) {
            next({
                // requires auth and user is not logged in
                path: '/login',
                query: {
                    redirect: to.fullPath
                }
            })
        }
        else if(!to.matched.some(record => record.meta.requiresAuth)) {
            next();
        } else {
            next();
        }
    } else {
        if(to.matched.some(record => record.meta.requiresAuth)) {
            if (!currentUser) {
                next({
                    // requires auth and user is not logged in
                    path: '/login',
                    query: {
                        redirect: to.fullPath
                    }
                });
            } else {
                // requires auth and user is logged in
                next();
            }
        } else {
            // does no require auth
            next();
        }
    }
});

export default router;
