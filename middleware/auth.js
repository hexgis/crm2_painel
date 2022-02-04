export default function ({ store, redirect, getRouteBaseName, localePath }) {
    store.dispatch('auth/tryAutoLogin')
    if (!store.state.auth.token) {
        if (getRouteBaseName() !== 'login') {
            return redirect(localePath('/login'))
        }
    } else if (getRouteBaseName() === 'login') {
        return redirect(localePath('/'))
    }
}
