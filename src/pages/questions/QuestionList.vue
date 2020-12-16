<template>
    <div>
        <div class="row align-items-baseline">
            <div class="col-auto mr-auto">
                <router-link
                  class="btn btn-success mb-2"
                  to="/questions/create">
                    Create
                </router-link>
            </div>
            <div class="col-auto">
                <div class="row">
                    <label class="col-form-label">Per page</label>
                    <div class="col">
                        <select class="form-control" @change="handlePerPageChange">
                            <option
                              v-for="(item, index) in perPageSet"
                              :key="index">{{ item }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-auto">
                <pagination :count="pageCount" :active="page" @paginate="handlePaginate" />
            </div>
        </div>
        <table class="table">
            <thead class="table-dark">
                <tr>
                    <th>#</th>
                    <th>Question</th>
                    <th>Answers</th>
                    <th class="text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="paginateItems.length">
                    <tr v-for="item in paginateItems" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.body }}</td>
                        <td>{{ item.answers.length }}</td>
                        <td class="text-right">
                            <router-link class="btn btn-success btn-sm" :to="`/questions/${item.id}`">
                                Edit
                            </router-link>
                            <button type="button"
                                    class="btn btn-danger btn-sm ml-2"
                                    @click="onDelete(item.id)">
                                Delete
                            </button>
                        </td>
                    </tr>
                </template>
                <tr v-else>
                    <td colspan="4" class="text-center">
                        No Data Available
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Pagination from "@/components/common/Pagination";
export default {
  name: "QuestionList",
  components: {
    Pagination
  },
  data: () => ({
    perPageSet: [3, 5, 10],
  }),
  created () {
    this.setPaginationFieldAction({ field: 'perPage', value: this.perPageDefault });
    this.setPageTitleAction({ field: 'pageTitle', value: 'Question List' });
  },
  computed: {
    ...mapState({
      questions: state => state.questions.items,
      perPage: state => state.questions.pagination.perPage,
      page: state => state.questions.pagination.page,
    }),
    ...mapGetters('questions', [
      'paginateItems',
    ]),
    perPageDefault () {
      return this.perPageSet[0];
    },
    pageCount () {
      return Math.ceil(this.questions.length / this.perPage);
    },
  },
  methods: {
    ...mapActions({
      setPageTitleAction: 'setField',
      deleteQuestionAction: 'questions/deleteItem',
      setPaginationFieldAction: 'questions/setPaginationField'
    }),
    handlePerPageChange ({ target }) {
      const { value } = target;
      this.setPaginationFieldAction({ field: 'perPage', value });
      this.setPaginationFieldAction({ field: 'page', value: 1 });
    },
    handlePaginate (value) {
      this.setPaginationFieldAction({ field: 'page', value });
    },
    onDelete (id) {
      this.deleteQuestionAction(id);
      this.controlPagination();
    },
    controlPagination () {
      if (!this.paginateItems.length && this.questions.length) {
        this.setPaginationFieldAction({ field: 'page', value: this.page - 1 });
      }
    }
  }
}
</script>

