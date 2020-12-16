import _ from 'lodash';

const state = {
  form: {
    body: '',
    answers: [],
    multiple: false,
  },
  items: [
    {
      id: 1,
      body: 'What sound does a dog make?',
      answers: ['Meow', 'Mooo', 'Hoo', 'Woof'],
      multiple: true,
      expected: [2, 3]
    },
    {
      id: 2,
      body: 'True or False: 3 + 3 = 6?',
      answers: ['True', 'False'],
      multiple: false,
      expected: 0
    },
    {
      id: 3,
      body: 'True or False: 1 + 5 = 6?',
      answers: ['True', 'False'],
      multiple: false,
      expected: 0
    },
    {
      id: 4,
      body: 'True or False: 5 + 5 = 12?',
      answers: ['True', 'False'],
      multiple: false,
      expected: 1
    },
    {
      id: 5,
      body: 'What is 8 + 8?',
      answers: ['16', '12', '88', 'Sixteen', 'Thirteen'],
      multiple: true,
      expected: [0, 3]
    },
    {
      id: 6,
      body: 'What sound does a cat make?',
      answers: ['meow', 'bark', 'no sound at all'],
      multiple: false,
      expected: 0
    },
    {
      id: 7,
      body: 'What is 1 + 3?',
      answers: ['13', '4', 'Four', 'Thirteen'],
      multiple: true,
      expected: [1, 2]
    },
    {
      id: 8,
      body: 'True or False: 12 + 7 = 17?',
      answers: ['True', 'False'],
      multiple: false,
      expected: 1
    },
  ],
  pagination: {
    perPage: null,
    page: 1,
  }
};

const mutations = {
  SET_FORM_FIELD: (state, { field, value }) => {
    if (Object.hasOwnProperty.call(state.form, field)) {
      state.form[field] = value;
    }
  },
  SET_FORM_FIELDS: (state, payload) => {
    for (const [field, value] of Object.entries(payload)) {
      if (Object.hasOwnProperty.call(state.form, field)) {
        state.form[field] = value;
      }
    }
  },
  TOGGLE_FORM_TYPE: (state) => {
    state.form.multiple = !state.form.multiple;
  },
  ADD_ANSWER: (state, payload) => {
    state.form.answers.push({
      body: payload,
      isCorrect: false
    });
  },
  DELETE_ANSWER: (state, payload) => {
    state.form.answers = state.form.answers
      .filter(({ body }) => body !== payload);
  },
  ADD_ITEM: (state, payload) => {
    state.items = [...state.items, payload];
  },
  UPDATE_ITEM: (state, payload) => {
    state.items = state.items
      .map((item) => payload.id === item.id
        ? _.cloneDeep(payload)
        : item);
  },
  RESET_STATUS_ANSWERS: (state) => {
    state.form.answers.forEach((answer) => answer.isCorrect = false);
  },
  DELETE_ITEM: (state, payload) => {
    state.items = state.items.filter(({ id }) => id !== payload);
  },
  SET_ANSWER_STATUS: (state, payload) => {
    state.form.answers = state.form.answers.map((answer) => {
      if (state.form.multiple) {
        answer.isCorrect = answer.body === payload ? !answer.isCorrect : answer.isCorrect;
      } else {
        answer.isCorrect = answer.body === payload;
      }
      return answer;
    });
  },
  INITIALIZE_FORM: (state) => {
    state.form = {
      body: '',
      answers: [],
      multiple: false,
    };
  },
  SET_PAGINATION_FIELD: (state, { field, value }) => {
    if (Object.hasOwnProperty.call(state.pagination, field)) {
      state.pagination[field] = value;
    }
  }
};

const actions = {
  setFormField: ({ commit }, payload) => { commit('SET_FORM_FIELD', payload); },
  toggleType: ({ commit }) => { commit('TOGGLE_FORM_TYPE'); },
  addAnswer: ({ commit }, payload) => { commit('ADD_ANSWER', payload); },
  deleteAnswer: ({ commit }, payload) => { commit('DELETE_ANSWER', payload) },
  createItem: ({ commit, state }) => {
    return new Promise((resolve) => {
      const answers = _.map(state.form.answers, 'body');
      const expected = state.form.answers.reduce((acc, { isCorrect }, i) => {
        if (isCorrect) acc.push(i);
        return acc;
      }, [])

      const payload = {
        ..._.omit(state.form),
        answers,
        expected,
        id: _.uniqueId('1')
      };

      commit('ADD_ITEM', payload);
      resolve(payload);
    })
  },
  getItem: ({ commit, state }, id) => {
    return new Promise(((resolve) => {
      const { body, answers, multiple, expected } = state.items
      .find((item) => item.id === id);

      const answersCollection = answers.map((item, i) => (
      {
        body: item,
        isCorrect: multiple ? expected.includes(i) : expected === i
      }
      ));

      const payload = {
        body,
        multiple,
        answers: answersCollection,
      };

      commit('SET_FORM_FIELDS', payload);
      resolve(payload);
    }));

  },
  updateItem: ({ commit, state }, id) => {
    return new Promise((resolve) => {
      const answers = _.map(state.form.answers, 'body');
      const expected = state.form.multiple
        ? state.form.answers
            .reduce((acc, { isCorrect }, i) => isCorrect ? [...acc, i] : acc, [])
        : _.findIndex(state.form.answers, 'isCorrect');

      const payload = {
        ..._.omit(state.form),
        answers,
        expected,
        id
      };

      commit('UPDATE_ITEM', payload);
      resolve(payload);
    })
  },
  deleteItem: ({ commit }, id) => { commit('DELETE_ITEM', id); },
  setAnswerStatus: ({ commit }, payload) => { commit('SET_ANSWER_STATUS', payload) },
  resetStatusAnswers: ({ commit }) => { commit('RESET_STATUS_ANSWERS') },
  initializeForm: ({ commit }) => { commit('INITIALIZE_FORM') },
  setPaginationField: ({ commit }, payload) => { commit('SET_PAGINATION_FIELD', payload) },
};

const getters = {
  isUniqueQuestion: state => !_.some(state.items, { body: state.form.body }),
  isUniqueQuestionExceptId: state => id => !_.some(state.items, (item) => (
    item.id !== id && item.body === state.form.body
  )),
  isUniqueAnswer: state => body => !_.some(state.form.answers, { body }),
  checkedCorrectAnswer: state => _.some(state.form.answers, 'isCorrect'),
  paginateItems: (state) => {
    const { page, perPage } = state.pagination;
    const from = (page - 1) * perPage;
    const to = from + Number(perPage);

    return state.items.slice(from, to);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
