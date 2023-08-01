export const state = () => ({
  draw: null,
  featureInventario: null,
  resultGroups: null,
  cqlFilter: null,
  currentDraw: null,
  fileUpload: null,
  showDialogInventario: false,
  searchLoading: false,
});

export const getters = {};

export const mutations = {
  setDraw(state, draw) {
    state.draw = draw;
  },

  setCqlFilter(state, cql) {
    state.cqlFilter = cql;
  },

  setFeatureInventario(state, value) {
    state.featureInventario = value;
  },

  setCurrentDraw(state, type) {
    state.currentDraw = type;
  },

  setFileUpload(state, file) {
    state.fileUpload = file;
  },

  setShowDialogInventario(state, value) {
    state.showDialogInventario = value;
  },

  setSearchLoading(state, value) {
    state.searchLoading = value;
  },
};

export const actions = {
  async getPropertiesInventario({ state, commit }) {
    commit('setSearchLoading', true);
    try {
      let geometry;
      if (state.draw) {
        geometry = {
          ...state.draw,
        };
      } else {
        geometry = state.fileUpload;
      }
      geometry = {
        geometry,
      };
      const data = await this.$api.post('agro/report/inventory/', geometry);
      commit('setFeatureInventario', data.data);
      commit('setShowDialogInventario', true);
    } catch (exception) {
      if (exception.response.status === 404) {
        commit(
          'alert/addAlert',
          { message: this.$i18n.t('no-result') },
          { root: true },
        );
      } else {
        commit(
          'alert/addAlert',
          {
            message: this.$i18n.t('default-error', {
              action: this.$i18n.t('retrieve'),
              resource: this.$i18n.tc('search', 1),
            }),
            timeout: 10000,
          },
          { root: true },
        );
      }
    } finally {
      commit('setSearchLoading', false);
    }
  },
};
