import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@clerk/vue'
import HomePage from '@/views/HomePage.vue'
import MetricsDashboard from '@/views/MetricsDashboard.vue'
import ConversationsLog from '@/views/ConversationsLog.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/metrics',
      name: 'metrics',
      component: MetricsDashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/conversations',
      name: 'conversations',
      component: ConversationsLog,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const { isSignedIn, isLoaded } = useAuth()

  // Wait for Clerk to load
  if (!isLoaded.value) {
    const unwatch = new Promise<void>((resolve) => {
      const checkLoaded = setInterval(() => {
        if (isLoaded.value) {
          clearInterval(checkLoaded)
          resolve()
        }
      }, 50)
    })
    await unwatch
  }

  // Redirect authenticated users from home to metrics
  if (to.name === 'home' && isSignedIn.value) {
    next({ name: 'metrics' })
    return
  }

  // Protect routes that require auth
  if (to.meta.requiresAuth && !isSignedIn.value) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router
