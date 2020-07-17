import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/panoview',
  routes,
})
router.beforeEach((to, from, next) => {
  next()
})
export default router
