export const state = () => ({
    bounds: null,
    boundsZoomed: false,
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

    toggleBoundsZoomed: (state) => (state.boundsZoomed = !state.boundsZoomed),
}

export const actions = {
    zoomToBounds({ commit }, bounds) {
        commit('setBounds', bounds)
        commit('toggleBoundsZoomed')
    },
}
