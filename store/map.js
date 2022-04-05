export const state = () => ({
    bounds: null,
    boundsZoomed: false,
    fileList: [],
    loading: false,
    localBounds: [],
})

export const getters = {
    bbox: (state) => state.bounds.toBBoxString(),

    bboxWkt(state) {
        const coords = [
            state.bounds.getSouthWest(),
            state.bounds.getNorthWest(),
            state.bounds.getNorthEast(),
            state.bounds.getSouthEast(),
        ]

        const wkt = coords.map((point) => point.lng + ' ' + point.lat)

        return 'POLYGON((' + wkt.join(',') + ',' + wkt[0] + '))'
    },
}

export const mutations = {
    setBounds: (state, bounds) => (state.bounds = bounds),

    setLocalBounds: (state, localBounds) => (state.localBounds = localBounds),

    toggleBoundsZoomed: (state) => (state.boundsZoomed = !state.boundsZoomed),

    setMapLoading(state, loading) {
        state.loading = loading
    },

    addFileToSpecificIndex(state, { file, fileIndex }) {
        state.fileList.splice(fileIndex, 0, file)
    },

    addFileToMap(state, file) {
        state.fileList.push(file)
    },

    removeFileFromMap(state, fileIndex) {
        state.fileList.splice(fileIndex, 1)
    },
}

export const actions = {
    zoomToBounds({ commit }, bounds) {
        commit('setBounds', bounds)
        commit('toggleBoundsZoomed')
    },

    changeStyle({ commit, state }, { fileIndex, color, opacity }) {
        const file = {
            ...state.fileList[fileIndex],
            color,
            opacity,
        }

        commit('removeFileFromMap', fileIndex)
        commit('addFileToSpecificIndex', { file, fileIndex })
    },
}
