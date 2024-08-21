export default function ({ store, redirect, getRouteBaseName, localePath, route }) {
    store.dispatch('auth/tryAutoLogin')
    if (!store.state.auth.token) {
      if (getRouteBaseName() === 'auth-confirmar') {
        const code = route.query.code;
        if (code) {
          store.commit('auth/setConfirmationCode', code);
        }
        return;
      }
      if (getRouteBaseName() !== 'login') {
        return redirect(localePath('/login'))
      }
    } else if (getRouteBaseName() === 'login') {
        return redirect(localePath('/'))
    }
}
