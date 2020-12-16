import {
  Dashboard,
  QuestionList,
  QuestionForm,
} from './import';

const questions = [
  {
    path: 'questions',
    name: 'questions',
    component: QuestionList,
  },
  {
    path: 'questions/create',
    name: 'questions-create',
    component: QuestionForm
  },
  {
    path: 'questions/:id',
    name: 'questions-edit',
    component: QuestionForm,
    props: true
  }
];

export default [
  {
    path: '/',
    name: 'home',
    component: Dashboard,
    redirect: '/questions',
    children: [
      ...questions,
    ]
  }
];
