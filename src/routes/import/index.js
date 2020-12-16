export const Dashboard = resolve => {
  require.ensure(['@/components/layout/Dashboard.vue'], () => {
    resolve(require('@/components/layout/Dashboard.vue'))
  })
};

export const QuestionList = resolve => {
  require.ensure(['@/pages/questions/QuestionList.vue'], () => {
    resolve(require('@/pages/questions/QuestionList.vue'))
  })
};

export const QuestionForm = resolve => {
  require.ensure(['@/pages/questions/QuestionForm.vue'], () => {
    resolve(require('@/pages/questions/QuestionForm.vue'))
  })
};
