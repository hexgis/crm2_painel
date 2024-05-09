export const state = () => ({
  activeMenu: '',
  openDrawPopup: null,
  startDrawPopup: false,
  bounds: null,
  boundsZoomed: false,
  fileList: [],
  loading: false,
  localBounds: [],
  buttonPopup: {},
  isDrawing: false,
  hasAddLayer: false,
});

export const getters = {
  bbox: (state) => state.bounds.toBBoxString(),

  bboxWkt(state) {
    const coords = [
      state.bounds.getSouthWest(),
      state.bounds.getNorthWest(),
      state.bounds.getNorthEast(),
      state.bounds.getSouthEast(),
    ];

    const wkt = coords.map((point) => `${point.lng} ${point.lat}`);

    return `POLYGON((${wkt.join(',')},${wkt[0]}))`;
  },
};

export const mutations = {
  setActiveMenu(state, payload) {
    state.activeMenu = payload !== state.activeMenu ? payload : '';
  },

  setBounds: (state, bounds) => (state.bounds = bounds),

  setLocalBounds: (state, localBounds) => (state.localBounds = localBounds),

  toggleBoundsZoomed: (state) => (state.boundsZoomed = !state.boundsZoomed),

  setMapLoading(state, loading) {
    state.loading = loading;
  },

  setStartDrawPopup(state) {
    state.startDrawPopup = !state.startDrawPopup;
  },

  setOpenDrawPopup(state, openDrawPopup) {
    state.openDrawPopup = openDrawPopup;
  },

  setButtonPopup(state, { type, layer }) {
    state.buttonPopup = { type, layer };
  },

  setIsDrawing(state, drawing) {
    state.isDrawing = drawing;
  },

  addFileToSpecificIndex(state, { file, fileIndex }) {
    state.fileList.splice(fileIndex, 0, file);
  },

  addFileToMap(state, file) {
    state.fileList.push(file);
  },

  removeFileFromMap(state, fileIndex) {
    state.fileList.splice(fileIndex, 1);
  },

  setHasLayer(state, hasLayer) {
    state.hasAddLayer = hasLayer;
  },
};

export const actions = {
  zoomToBounds({ commit }, bounds) {
    commit('setBounds', bounds);
    commit('toggleBoundsZoomed');
  },

  changeStyle({ commit, state }, { fileIndex, color, opacity }) {
    const file = {
      ...state.fileList[fileIndex],
      color,
      opacity,
    };

    commit('removeFileFromMap', fileIndex);
    commit('addFileToSpecificIndex', { file, fileIndex });
  },

  async saveToDatabase({ state, commit }, { index }) {
    try {
      const { feature } = state.fileList[index];
      const { name } = state.fileList[index];

      const response = await this.$api.post('user/upload-file/', {
        name,
        geometry: feature,
      });

      if (response) {
        commit(
          'alert/addAlert',
          {
            message: this.$i18n.t('upload-success', {
              date: response.data.created_at,
              name: response.data.name,
              new_data: response.data.created,
              updated_data: response.data.updated,
            }),
          },
          { root: true },
        );
        commit('setHasLayer', true);
      }
    } catch (exception) {
      commit(
        'alert/addAlert',
        {
          message: this.$i18n.t('default-error', {
            action: this.$i18n.t('retrieve'),
            resource: this.$i18n.tc('imagery', 2),
          }),
        },
        { root: true },
      );
    }
  },

  async saveDrawToDatabase({ commit }, { geometry, name }) {
    try {
      const response = await this.$api.post('user/upload-file/', {
        name,
        geometry,
      });

      if (response) {
        commit(
          'alert/addAlert',
          {
            message: this.$i18n.t('upload-success', {
              date: response.data.created_at,
              name: response.data.name,
              new_data: response.data.created,
              updated_data: response.data.updated,
            }),
          },
          { root: true },
        );
        commit('setHasLayer', true);
      }
    } catch (exception) {
      commit(
        'alert/addAlert',
        {
          message: this.$i18n.t('default-error', {
            action: this.$i18n.t('retrieve'),
            resource: this.$i18n.tc('imagery', 2),
          }),
        },
        { root: true },
      );
    }
  },



};
