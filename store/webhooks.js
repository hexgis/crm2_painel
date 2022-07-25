export const state = () => ({
    showFeatures: false,
    results: [],
    points: [],
    connection: null,
    point: [],
    url: '',
    messageCallback: null,
    paused: false,
})

export const mutations = {
    setShowFeatures(state, showFeatures) {
        state.showFeatures = showFeatures
    },

    addResult: (state, result) => {
        state.results.unshift(result)
        state.points.push(state.point)
    },

    clearResults: (state) => {
        state.results = []
        state.points = []
    },

    setPoint: (state, point) => (state.point = point),

    newConnection: (state, { url, msgCallback }) => {
        if (state.connection) {
            state.connection.close()
        }
        state.paused = false
        state.url = url
        state.messageCallback = msgCallback

        state.connection = new WebSocket(url)
        state.connection.onmessage = msgCallback
    },

    pauseConnection: (state) => {
        state.connection.close()
        state.paused = true
    },

    resumeConnection: (state) => {
        state.paused = false
        state.connection = new WebSocket(state.url)
        state.connection.onmessage = state.messageCallback
    },
}

export const actions = {
    connectWebhook({ commit }, url) {
        if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
            url = 'ws://' + url
        }

        const msgCallback = function (event) {
            const data = JSON.parse(event.data)
            commit('addResult', data[0])
        }
        commit('newConnection', { url, msgCallback })
        commit('setShowFeatures', true)
    },
}
