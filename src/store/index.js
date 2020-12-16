import Vue from 'vue';
import Vuex from 'vuex';

import questions from './questions';

Vue.use(Vuex);

const state = {
  pageTitle: ''
};

const mutations = {
  SET_FIELD: (state, { field, value }) => {
    if (Object.hasOwnProperty.call(state, field)) {
      state[field] = value;
    }
  }
};

const actions = {
  setField: ({ commit }, payload) => {
    commit('SET_FIELD', payload);
  }
};

const getters = {

};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    questions,
  }
});
