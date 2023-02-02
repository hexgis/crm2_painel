export const state = () => ({
  features: null,
  showFeatures: false,
  heatMap: false,
  tableDialogDeter: false,
  isLoadingTable: true,
  isLoadingFeatures: false,
  isLoadingGeoJson: false,
  isLoadingCSV: false,
  unitMeasurement: [],
  // displayAnalitcs: null, // responsável por exibir qual dos 4 Dashboards será exibido na tela: Filtro Aplicado; CR; TI; Municípios. Também encaminhar o filtro aplicado.
  visualizationStage: 'map',
  filterOptions: {
    regionalFilters: [],
    tiFilters: [],
  },

  filters: {
    startDate: null,
    endDate: null,
    currentView: false,
    priority: null,
    csv: 'csv',
    json: 'json',
  },

  opacity: 100,
  total: null,
  table: [],
  tableCSV: [],
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

  setParams(state, params) {
    state.params = params;
  },

  setFeatures(state, features) {
    state.features = features;
  },

  settableDialogDeter(state, tableDialogDeter) {
    state.tableDialogDeter = tableDialogDeter;
  },

  setLoadingTable(state, loadingTable) {
    state.isLoadingTable = loadingTable;
  },

  setLoadingFeatures(state, payload) {
    state.isLoadingFeatures = payload;
  },

  clearFeatures(state) {
    state.features = null;
  },

  setLoadingCSV(state, payload) {
    state.isLoadingCSV = payload;
  },

  setLoadingGeoJson(state, payload) {
    state.isLoadingGeoJson = payload;
  },

  setShowFeatures(state, showFeatures) {
    state.showFeatures = showFeatures;
  },

  setOpacity(state, opacity) {
    state.opacity = opacity;
  },

  setTable(state, table) {
    state.table = table;
  },

  setDownloadTable(state, tableCSV) {
    state.tableCSV = tableCSV;
  },

  setFilterOptions(state, data) {
    state.filterOptions = data;
  },

  setTotal(state, total) {
    state.total = total;
  },

  setHeatMap(state, heatMap) {
    state.heatMap = heatMap;
  },

  setUnitMeasurement(state, unitMeasurement) {
    state.unitMeasurement = unitMeasurement;
  },

  setVisualizationStage(state, visualizationStage) {
    state.visualizationStage = visualizationStage;
  },
};

export const actions = {
  async getFeatures({ state, commit, rootGetters }) {
    commit('setLoadingGeoJson', true);
    commit('setLoadingFeatures', true);
    commit('clearFeatures');

    const params = {
      start_date: state.filters.startDate,
      end_date: state.filters.endDate,
    };

    if (state.filters.ti && state.filters.ti.length) {
      const arrayTI = [];
      Object.values(state.filters.ti).forEach((item) => {
        arrayTI.push(item.co_funai);
      });
      params.co_funai = arrayTI.toString();
    }

    if (state.filters.cr && state.filters.cr.length) {
      const arrayCR = [];
      Object.values(state.filters.cr).forEach((item) => {
        arrayCR.push(item.co_cr);
      });
      params.co_cr = arrayCR.toString();
    }

    if (state.filters.currentView) params.in_bbox = rootGetters['map/bbox'];

    try {
      const response = await this.$api.$get('monitoring/deter/', {
        params,
      });

      if (!response.features || !response.features.length) {
        commit('setShowFeatures', false);
        commit(
          'alert/addAlert',
          { message: this.$i18n.t('no-result') },
          { root: true },
        );
      } else {
        commit('setShowFeatures', true);
        commit('setFeatures', response);

        const total = await this.$api.$get(
          'monitoring/deter/map-stats/',
          {
            params,
          },
        );
        if (total) commit('setTotal', total);
      }
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
      commit('setParams', params);
      commit('setLoadingGeoJson', false);
    }
  },

  async getFilterOptions({ commit }) {
    const regional_coordinators = await this.$api.$get('funai/cr/');

    const data = {};

    if (regional_coordinators) {
      data.regionalFilters = regional_coordinators.sort(
        (a, b) => a.ds_cr > b.ds_cr,
      );
    }

    commit('setFilterOptions', data);
  },

  async getTiOptions({ commit, state }, cr) {
    const params = {
      co_cr: cr.toString(),
    };

    const tis = await this.$api.$get('funai/ti/', { params });

    if (tis) {
      commit('setFilterOptions', {
        ...state.filterOptions,
        tiFilters: tis.sort((a, b) => a.no_ti > b.no_ti),
      });
    }
  },

  async getDataTable({ commit, state, rootGetters }) {
    commit('setLoadingFeatures', true);
    commit('setLoadingGeoJson', true);
    commit('setLoadingTable', true);
    const params = {
      start_date: state.filters.startDate,
      end_date: state.filters.endDate,
    };

    if (state.filters.ti && state.filters.ti.length) {
      const arrayTI = [];
      Object.values(state.filters.ti).forEach((item) => {
        arrayTI.push(item.co_funai);
      });
      params.co_funai = arrayTI.toString();
    }

    if (state.filters.cr && state.filters.cr.length) {
      const arrayCR = [];
      Object.values(state.filters.cr).forEach((item) => {
        arrayCR.push(item.co_cr);
      });
      params.co_cr = arrayCR.toString();
    }

    if (state.filters.currentView) params.in_bbox = rootGetters['map/bbox'];

    try {
      const table = await this.$api.$get('monitoring/deter/table/', {
        params,
      });

      if (table) commit('setTable', table);

      const total = await this.$api.$get('monitoring/deter/map-stats/', {
        params,
      });
      if (total) commit('setTotal', total);
    } catch (error) {
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
      commit('setLoadingGeoJson', false);
      commit('setLoadingTable', false);
    }
  },
  async downloadTable({ commit, state, rootGetters }) {
    commit('setLoadingCSV', true);

    const params = {
      start_date: state.filters.startDate,
      end_date: state.filters.endDate,
      format: state.filters.csv,
    };

    if (state.filters.ti && state.filters.ti.length) {
      const arrayTI = [];
      Object.values(state.filters.ti).forEach((item) => {
        arrayTI.push(item.co_funai);
      });
      params.co_funai = arrayTI.toString();
    }

    if (state.filters.cr && state.filters.cr.length) {
      const arrayCR = [];
      Object.values(state.filters.cr).forEach((item) => {
        arrayCR.push(item.co_cr);
      });
      params.co_cr = arrayCR.toString();
    }

    if (state.filters.currentView) params.in_bbox = rootGetters['map/bbox'];

    const tableCSV = await this.$api.get('monitoring/deter/table/', {
      params,
    });

    function saveData(data, fileName, type) {
      let elementBtn; let blob; let
        url;

      elementBtn = document.createElement('a');
      elementBtn.style = 'display: none';
      document.body.appendChild(elementBtn);

      if (type !== 'text/csv') {
        data = JSON.stringify(data);
      }

      blob = new Blob([data], { type });
      url = window.URL.createObjectURL(blob);

      elementBtn.href = url;
      elementBtn.download = fileName;
      elementBtn.click();
      window.URL.revokeObjectURL(url);
    }

    try {
      saveData(tableCSV.data, 't_poligono-deter.csv', 'text/csv');
    } finally {
      commit('setLoadingCSV', false);
    }
  },
  async downloadGeoJson({ commit, state, rootGetters }) {
    commit('setLoadingGeoJson', true);

    const params = {
      start_date: state.filters.startDate,
      end_date: state.filters.endDate,
      format: state.filters.csv,
      format: state.filters.json,
    };

    if (state.filters.ti && state.filters.ti.length) {
      const arrayTI = [];
      Object.values(state.filters.ti).forEach((item) => {
        arrayTI.push(item.co_funai);
      });
      params.co_funai = arrayTI.toString();
    }

    if (state.filters.cr && state.filters.cr.length) {
      const arrayCR = [];
      Object.values(state.filters.cr).forEach((item) => {
        arrayCR.push(item.co_cr);
      });
      params.co_cr = arrayCR.toString();
    }

    if (state.filters.currentView) params.in_bbox = rootGetters['map/bbox'];

    const GeoJson = await this.$api.get('monitoring/deter/', {
      params,
    });

    function saveData(data, fileName, type) {
      let elementBtn; let blob; let
        url;

      elementBtn = document.createElement('a');
      elementBtn.style = 'display: none';
      document.body.appendChild(elementBtn);

      if (type !== 'text/csv') {
        data = JSON.stringify(data);
      }

      blob = new Blob([data], { type });
      url = window.URL.createObjectURL(blob);

      elementBtn.href = url;
      elementBtn.download = fileName;
      elementBtn.click();
      window.URL.revokeObjectURL(url);
    }

    try {
      saveData(
        GeoJson.data,
        'p_poligono-deter.json',
        'application/json',
      );
    } finally {
      commit('setLoadingGeoJson', false);
    }
  },
};
