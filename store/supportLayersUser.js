import Vue from 'vue';

export const state = () => ({
  supportLayerUser: {},
  popupInfo: {},
});

export const mutations = {
  setSupportLayersUser(state, LayersUser) {
    state.supportLayerUser = {};
    for (const layer of LayersUser) {
      layer.visible = false;
      layer.opacity = 100;
      layer.loading = false;
      layer.geometry = null;
      Vue.set(state.supportLayerUser, layer.id, layer);
    }
  },

  setLayerLoading(state, { id, loading }) {
    state.supportLayerUser[id].loading = loading;
  },

  setLayersUserGeojson(state, { layer, response }) {
    state.supportLayerUser[layer.id].geometry = response;
  },

  setLayersDetail(state, { info, response }) {
    state.popupInfo[info.id] = response;
  },

  toggleLayerVisibility(state, { id, visible }) {
      state.supportLayerUser[id].visible = visible;
      },

  setLayerOpacity(state, { id, opacity }) {
    state.supportLayerUser[id].opacity = opacity;
  },
};

export const actions = {
  async getLayersUser({ commit }) {
    const response = await this.$api.$get('user/upload-file/list/');
    if (response) {
      commit('setSupportLayersUser', response);
    }
  },

  async getLayersUserGeoJson({ commit }, layer) {
    const { id } = layer;
    commit('setLayerLoading', { id, loading: true });

    const response = await this.$api.$get(`user/upload-file/geo/${layer.id}/`);
    if (response) {
      commit('setLayersUserGeojson', { layer, response });
      commit('setLayerLoading', { id, loading: false });
    }
  },



};
