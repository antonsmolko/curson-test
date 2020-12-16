<template>
    <div>
        <div class="d-flex justify-content-between">
            <router-link class="btn btn-success" to="/questions">Back</router-link>
            <button v-if="editing"
                    class="btn btn-danger"
                    @click="onDelete">
                Delete
            </button>
        </div>

        <div class="card mt-3">
            <div class="card-header">
                Settings
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label" for="question_body">Question</label>
                    <input
                      type="text"
                      class="form-control"
                      :class="[
                        { 'is-invalid': $v.question.$error },
                        { 'is-valid': !$v.question.$invalid }
                      ]"
                      id="question_body"
                      name="question"
                      :value="question"
                      @input="inputQuestion">
                    <div class="valid-feedback">Looks good!</div>
                    <div class="invalid-feedback" v-if="!$v.question.minLength">
                        The field «Question» must contain at least {{ $v.question.$params.minLength.min }} characters!
                    </div>
                    <div class="invalid-feedback" v-if="!$v.question.required">
                        The field «Question» is required!
                    </div>
                    <div class="invalid-feedback" v-if="!$v.question.isUnique">
                        The field «Question» must be unique!
                    </div>
                </div>

                <h5 class="mt-5">Answers</h5>

                <div class="row">
                    <div class="col-sm-6">
                        <form
                          @submit.prevent="addAnswer">
                            <div class="form-row">
                                <div class="col my-1">
                                    <input
                                      :class="[
                                        { 'is-invalid': !$v.newAnswer.isUnique },
                                        { 'is-valid': !$v.newAnswer.$invalid }
                                      ]"
                                      ref="answer"
                                      type="text"
                                      class="form-control"
                                      name="newAnswer"
                                      placeholder="Input answer"
                                      v-model="newAnswer">
                                    <div class="invalid-feedback" v-if="!$v.newAnswer.isUnique">
                                        The field «Answer» must be unique!
                                    </div>
                                </div>
                                <div class="col-auto my-1">
                                    <button
                                      type="submit"
                                      :disabled="$v.newAnswer.$invalid || !$v.newAnswer.minLength"
                                      class="btn btn-primary">
                                        Add
                                    </button>
                                </div>
                            </div>

                        </form>
                    </div>
                    <div class="col">
                        <ul class="list-group">
                            <li class="list-group-item list-group-item-secondary d-flex justify-content-between align-items-center">
                                <span>Answers List</span>
                                <div class="custom-control custom-switch">
                                    <input
                                      type="checkbox"
                                      class="custom-control-input"
                                      id="question_type"
                                      name="multiple"
                                      :checked="multiple"
                                      @change="toggleType">
                                    <label class="custom-control-label" for="question_type">Multiple</label>
                                </div>
                            </li>
                            <li
                              v-for="(answer, index) in answers"
                              :key="answer.body"
                              class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="form-check">
                                    <input
                                      :type="answerInputType"
                                      class="form-check-input"
                                      :name="getAnswerInputName(index)"
                                      :id="`answer-${index + 1}`"
                                      :checked="answer.isCorrect"
                                      @input="setAnswerStatus(answer.body)">
                                    <label class="form-check-label"
                                           :for="`answer-${index + 1}`">
                                        {{ answer.body }}
                                    </label>
                                </div>
                                <button
                                  class="btn btn-danger btn-sm"
                                  @click="deleteAnswer(answer.body)">
                                    Delete
                                </button>
                            </li>
                            <li v-if="!answers.length" class="list-group-item alert-secondary">
                                No data available!
                            </li>
                        </ul>
                    </div>
                </div>

                <button
                  class="btn btn-primary mt-4"
                  :disabled="formInvalid"
                  @click="save">
                    {{ editing ? 'Update' : 'Create' }}
                </button>
            </div>
        </div>

    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { required, minLength } from 'vuelidate/lib/validators';
import debounce from 'lodash/debounce';
const _debounce = debounce(f => f(), 500);

export default {
  name: "QuestionForm",
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  data: () => ({
    editing: false,
    newAnswer: ''
  }),
  validations: {
    question: {
      required,
      minLength: minLength(4),
      touch: false,
      isUnique (value) {
        return (value.trim() === '') && !this.$v.question.$dirty || this.isUniqueQuestion;
      }
    },
    newAnswer: {
      required,
      touch: false,
      minLength: minLength(1),
      isUnique (value) {
        return (value.trim() === '') && !this.$v.newAnswer.$dirty || this.isUniqueAnswer;
      }
    }
  },
  computed: {
    ...mapState({
      questions: state => state.questions.items,
      question: state => state.questions.form.body,
      multiple: state => state.questions.form.multiple,
      answers: state => state.questions.form.answers
    }),
    isUniqueQuestion () {
      return this.editing
        ? this.$store.getters['questions/isUniqueQuestionExceptId'](Number(this.id))
        : this.$store.getters['questions/isUniqueQuestion'];
    },
    isUniqueAnswer () {
      return this.$store.getters['questions/isUniqueAnswer'](this.newAnswer);
    },
    checkedCorrectAnswer () {
      return this.$store.getters['questions/checkedCorrectAnswer'];
    },
    pageTitle () {
      return this.id ? `Question # ${this.id} Form` : 'Create New Question';
    },
    answerInputType () {
      return this.multiple ? 'checkbox' : 'radio';
    },
    formInvalid () {
      return this.$v.question.$invalid || this.answers.length < 2 || !this.checkedCorrectAnswer;
    },
  },
  watch: {
    newAnswer () {
      this.inputValidate('newAnswer');
    }
  },
  created () {
    if (this.id) {
      this.editing = true;
      this.getQuestionAction(Number(this.id));
    }
    this.setPageTitleAction({ field: 'pageTitle', value: this.pageTitle });
  },
  beforeDestroy () {
    this.initializeFormAction();
  },
  methods: {
    ...mapActions({
      setPageTitleAction: 'setField',
      setFormFieldAction: 'questions/setFormField',
      addAnswerAction: 'questions/addAnswer',
      toggleTypeAction: 'questions/toggleType',
      setAnswerStatusAction: 'questions/setAnswerStatus',
      deleteAnswerAction: 'questions/deleteAnswer',
      resetStatusAnswersAction: 'questions/resetStatusAnswers',
      initializeFormAction: 'questions/initializeForm',
      getQuestionAction: 'questions/getItem',
      createQuestionAction: 'questions/createItem',
      updateQuestionAction: 'questions/updateItem',
      deleteQuestionAction: 'questions/deleteItem'
    }),
    addAnswer () {
      this.addAnswerAction(this.newAnswer);
      this.newAnswer = '';
      this.$nextTick(() => {
        this.$refs.answer.focus();
      });
    },
    inputQuestion ({ target }) {
      const { value } = target;
      this.setFormFieldAction({ field: 'body', value });
      this.inputValidate('question');
    },
    toggleType () {
      this.toggleTypeAction();
      this.resetStatusAnswersAction();
    },
    getAnswerInputName (index) {
      return this.multiple ? `expected-${index + 1}` : 'expected';
    },
    setAnswerStatus (payload) {
      this.setAnswerStatusAction(payload);
    },
    deleteAnswer (payload) {
      this.deleteAnswerAction(payload);
    },
    inputValidate (name) {
      this.$v[name].$reset();
      _debounce(this.$v[name].$touch);
    },
    async save () {
      this.editing
       ? await this.updateQuestionAction(Number(this.id))
       : await this.createQuestionAction();
      await this.$router.push('/questions');
    },
    onDelete () {
      this.deleteQuestionAction(Number(this.id));
      this.$router.push('/questions');
    }
    // isDiffer (a, b) {
    //   return a != b;
    // }
  }
}
</script>

