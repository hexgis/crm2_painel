export const state = () => ({
    bookmarks: [],
    saving: false,
    loading: false,
})

export const mutations = {
    setBookmarks(state, bookmarks) {
        state.bookmarks = bookmarks

        state.bookmarks.forEach((bookmark) => {
            if (bookmark.catalogs.length) {
                bookmark.catalogs.forEach((catalog) => {
                    catalog.visible = false
                })
            }
        })
    },

    toggleCatalogLayer(state, { bookmarkId, layerId, visible }) {
        state.bookmarks[bookmarkId].catalogs.splice(layerId, 1, {
            ...state.bookmarks[bookmarkId].catalogs[layerId],
            visible,
        })
    },

    setSaving(state, saving) {
        state.saving = saving
    },

    setLoading(state, loading) {
        state.loading = loading
    },
}

export const actions = {
    async saveBookmark({ commit, rootGetters }, name) {
        commit('setSaving', true)
        try {
            await this.$api.$post('bookmark/', {
                name,
                layers_id: rootGetters['supportLayers/activeLayerIds'],
                catalogs_images: rootGetters['catalog/activeImages'],
                bbox: rootGetters['map/bboxWkt'],
            })
        } catch (exc) {
            commit(
                'alert/addAlert',
                {
                    message: this.$i18n.t('default-error', {
                        action: this.$i18n.t('save-action'),
                        resource: this.$i18n.tc('bookmark', 1),
                    }),
                },
                { root: true }
            )
        } finally {
            commit('setSaving', false)
        }
    },

    async getBookmarks({ commit }) {
        commit('setLoading', true)
        try {
            const response = await this.$api.$get('bookmark/')

            commit('setBookmarks', response)
        } catch (exception) {
            commit(
                'alert/addAlert',
                {
                    message: this.$i18n.t('default-error', {
                        action: this.$i18n.t('retrieve'),
                        resource: this.$i18n.tc('bookmark', 2),
                    }),
                },
                { root: true }
            )
        } finally {
            commit('setLoading', false)
        }
    },
}
