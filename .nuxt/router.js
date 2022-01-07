import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _5f002629 = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _d54ef9dc = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
const _6fed7415 = () => interopDefault(import('../pages/index/monitoring.vue' /* webpackChunkName: "pages/index/monitoring" */))
const _0242c5d2 = () => interopDefault(import('../pages/index/support.vue' /* webpackChunkName: "pages/index/support" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/login",
    component: _5f002629,
    name: "login"
  }, {
    path: "/",
    component: _d54ef9dc,
    name: "index",
    children: [{
      path: "monitoring",
      component: _6fed7415,
      name: "index-monitoring"
    }, {
      path: "support",
      component: _0242c5d2,
      name: "index-support"
    }]
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
