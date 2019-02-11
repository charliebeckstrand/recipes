import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
      recipes: [],

      user: {}
  },
  mutations: {
      setRecipes(state, recipes) {
          state.recipes = recipes;
      },
      setUser(state, user) {
          state.user = user;
      }
  },
  actions: {
      getRecipes(context) {
          return state.recipes;
      },
      getUser(context) {
          return state.user;
      }
  }
});
