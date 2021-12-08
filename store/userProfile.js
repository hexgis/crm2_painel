export const state = () => ({
    user: null,
    updating: false,
})

export const mutations = {
    setUser(state, { user }) {
        state.user = user
    },

    setUserSettings(state, { settings }) {
        state.user = { ...state.user, settings }
    },

    setUpdating(state, updating) {
        state.updating = updating
    },
}

export const actions = {
    async getUserData({ commit }) {
        return await this.$api.$get('user-profile/logged').then((data) => {
            commit('setUser', {
                user: data,
            })
        })
    },

    async updateSettings({ commit }, settings) {
        return await this.$api
            .$put('user-profile/update-settings', settings)
            .then((data) => {
                commit('setUserSettings', {
                    settings: data,
                })
            })
    },
}
