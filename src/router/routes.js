const routes = [
  // {
  //   path: '/home',
  //   name: 'home',
  //   component: () => import('pages/IndexPage.vue'),
  // },
  {
    path: '/',
    name: 'login',
    component: () => import('pages/IndexPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
