export const state = () => ({
    showTableDialog: false,
})

export const mutations = {
    setshowTableDialog(state, payload) {
        state.showTableDialog = payload
    },
}
