export default function ({ store, redirect, route, getRouteBaseName, localePath }) {
    if (route.path.startsWith('/pt-br/')) {
      const newPath = route.path.replace('/pt-br', '')
      return redirect(newPath)
    }
    store.dispatch('auth/tryAutoLogin')
    if (!store.state.auth.token) {
      if (getRouteBaseName() === 'cadastro') {
        return
    }
        if (getRouteBaseName() !== 'login') {
            return redirect(localePath('/login'))
        }
    } else if (getRouteBaseName() === 'login') {
        return redirect(localePath('/'))
    }
}
