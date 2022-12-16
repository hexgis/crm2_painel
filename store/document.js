export const state = () => ({
  features: null,
  showFeatures: false,
  isLoadingFeatures: false,
  isLoadingDocumentActions: false,
  isLoadingUploadDocument: false,
  showDialogDocument: false,
  visualizationStage: 'map',
  filterOptions: {
    regionalFilters: [],
    tiFilters: [],
    tiFiltersUpload: [],
    actions: [],
  },
  filters: {
    startDate: null,
    endDate: null,
  },
});

export const getters = {
  featuresLoaded(state) {
    return (
      !!state.features
            && state.features.features
            && state.features.features.length > 0
    );
  },
};

export const mutations = {
  setFilters(state, filters) {
    state.filters = {
      ...state.filters,
      ...filters,
    };
  },

  setShowDialogDocument(state, payload) {
    state.showDialogDocument = payload;
  },

  setFeatures(state, features) {
    state.features = features;
  },

  setIsLoadingUploadDocument(state, payload) {
    state.isLoadingUploadDocument = payload;
  },

  setLoadingDocumentActions(state, payload) {
    state.isLoadingDocumentActions = payload;
  },

  setDocumentActions(state, payload) {
    state.filterOptions.actions = payload;
  },

  setActions(state, actions) {
    state.actions = actions;
  },

  setLoadingFeatures(state, payload) {
    state.isLoadingFeatures = payload;
  },

  clearFeatures(state) {
    state.features = null;
  },

  setFilterOptionsCr(state, data) {
    state.filterOptions.regionalFilters = data.regionalFilters;
  },

  setFilterOptionsTi(state, data) {
    state.filterOptions.tiFilters = data;
  },

  setFilterOptionsTiUpload(state, { tiFiltersUpload }) {
    state.filterOptions.tiFiltersUpload = tiFiltersUpload;
  },

};

export const actions = {
  async getFeatures({ state, commit, rootGetters }, data) {
    commit('setLoadingFeatures', true);
    commit('setFeatures', null);
    const params = { ...data };
    params.id_acao = params.id_acao.toString();
    if (params.ti) {
      params.ti = params.ti.toString();
    }
    if (params.cr) {
      params.cr = params.cr.toString();
    }
    try {
      const response = await this.$api.$get('/documental/list/', { params });
      commit('setFeatures', response);
    } catch (exception) {
      commit(
        'alert/addAlert',
        {
          message: this.$i18n.t('default-error', {
            action: this.$i18n.t('retrieve'),
            resource: this.$i18n.t('monitoring'),
          }),
        },
        { root: true },
      );
    } finally {
      commit('setLoadingFeatures', false);
    }
  },

  async getDocumentActions({ state, commit }, actionType) {
    commit('setLoadingDocumentActions', true);

    try {
      const documentActions = await this.$api.$get(`documental/list-actions/?action_type=${actionType}`);

      if (documentActions) commit('setDocumentActions', documentActions);
    } catch (exception) {
      commit(
        'alert/addAlert',
        {
          message: this.$i18n.t('default-error', {
            action: this.$i18n.t('retrieve'),
            resource: this.$i18n.t('monitoring'),
          }),
        },
        { root: true },
      );
    } finally {
      commit('setLoadingDocumentActions', false);
    }
  },

  async getFilterOptions({ commit }) {
    const regionalCoordinates = await this.$api.$get('funai/cr/');
    const data = {};
    if (regionalCoordinates) {
      data.regionalFilters = regionalCoordinates.sort(
        (a, b) => a.ds_cr > b.ds_cr,
      );
    }
    commit('setFilterOptionsCr', data);
  },

  async getTiOptions({ commit, state }, cr) {
    const params = {
      co_cr: cr.toString(),
    };
    const tis = await this.$api.$get('funai/ti/', { params });
    if (tis) {
      commit(
        'setFilterOptionsTi',
        tis.sort((a, b) => a.no_ti > b.no_ti),
      );
    }
  },

  async getTiUploadOptions({ commit, state }, cr) {
    const tis = await this.$api.$get('funai/ti/');
    if (tis) {
      commit('setFilterOptionsTiUpload', {
        tiFiltersUpload: tis.sort((a, b) => a.no_ti > b.no_ti),
      });
    }
  },

  async uploadIndigenousDocuments({ commit, state }, { formData, filters }) {
    commit('setIsLoadingUploadDocument', true);
    try {
      // const response = await
      // this.$api.post(`documental/upload/?id_acao=${filters.ac}`, formData);
    } catch (exception) {
      commit(
        'alert/addAlert',
        {
          message: this.$i18n.t('default-error', {
            action: this.$i18n.t('retrieve'),
            resource: this.$i18n.t('monitoring'),
          }),
        },
        { root: true },
      );
    } finally {
      commit('setIsLoadingUploadDocument', false);
    }
  },
};
