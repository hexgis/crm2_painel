export const state = () => ({
    alerts: [],
})

export const mutations = {
    addAlert(state, { message, timeout, actionLabel, action, payload }) {
        state.alerts.push({
            message,
            timeout,
            actionLabel,
            action,
            payload,
        })
    },

    popAlert(state) {
        state.alerts.splice(0, 1)
    },
}
