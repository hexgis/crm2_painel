export const state = () => ({
  showFeatures: false,
  showFilters: true,
  satellites: [],

  scenes: [],
  otherPageScenes: [],
  sceneCount: null,
  scenesPerPage: 20,
  page: 1,

  hoveredScene: null,
  hoveredGridScene: null,
  zoomedScene: null,

  scenesToCompare: {
    leftIndex: null,
    leftImage: null,
    leftInOtherPage: false,
    rightIndex: null,
    rightImage: null,
    rightInOtherPage: false,
  },

  isComparing: false,

  isLoadingScenes: false,

  filters: null,

  timelineScenes: [],
  showTimeline: false,
  lastIndex: null,
});

export const getters = {
  showScenes(state) {
    return state.scenes && state.scenes.length > 0;
  },

  activeImages(state) {
    const activeImages = [];
    for (const scene of state.scenes) {
      if (scene.tmsVisible) {
        activeImages.push(scene.image);
      }
    }
    return activeImages;
  },
};

export const mutations = {
  setShowFeatures(state, showFeatures) {
    state.showFeatures = showFeatures;
  },

  setSatellites(state, satellites) {
    state.satellites = satellites;
  },

  setScenes(state, { scenes, page }) {
    state.scenes = [];
    for (const scene of scenes) {
      scene.tmsVisible = false;
      scene.page = page;
      state.scenes.push(scene);
    }
  },

  setSceneCount(state, count) {
    state.sceneCount = count;
  },

  setPage(state, page) {
    state.page = page;
  },

  toggleTmsVisibility(state, { index, tmsVisible }) {
    state.scenes.splice(index, 1, {
      ...state.scenes[index],
      tmsVisible,
    });
  },

  clearScenes(state) {
    state.scenes = [];
    state.otherPageScenes = [];
    state.sceneCount = 0;
  },

  setLoadingScenes(state, payload) {
    state.isLoadingScenes = payload;
  },

  setFilters(state, filters) {
    state.filters = {
      ...state.filters,
      ...filters,
    };
  },

  setTimelineScenes(state, scenes) {
    state.timelineScenes = [];
    for (const scene of scenes.features) {
      scene.visible = false;
      state.timelineScenes.push(scene);
    }

    state.showTimeline = true;
  },

  setShowTimeline(state, timeline) {
    state.showTimeline = timeline;
    if (!timeline && state.timelineScenes[state.lastIndex]) {
      state.timelineScenes[state.lastIndex].visible = false;
      state.lastIndex = null;
    }
  },

  setVisibility(state, { scene, visible }) {
    let index;

    for (let i = 0; i < state.timelineScenes.length; i++) {
      if (state.timelineScenes[i].image === scene.image) {
        index = i;
        break;
      }
    }

    state.timelineScenes[index].visible = visible;
    if (state.lastIndex == null || index == state.lastIndex) {
      state.lastIndex = index;
    } else {
      state.timelineScenes[state.lastIndex].visible = false;
      state.lastIndex = index;
    }
  },

  setHoveredScene(state, scene) {
    state.hoveredScene = scene;
  },

  setHoveredGridScene(state, sceneIndex) {
    state.hoveredGridScene = sceneIndex;
  },

  setZoomedScene(state, scene) {
    state.zoomedScene = scene;
  },

  toggleSceneToCompare(state, sceneIndex) {
    if (
      state.scenesToCompare.leftIndex === sceneIndex
      && !state.scenesToCompare.leftInOtherPage
    ) {
      state.scenesToCompare.leftIndex = null;
    } else if (
      state.scenesToCompare.rightIndex === sceneIndex
      && !state.scenesToCompare.rightInOtherPage
    ) {
      state.scenesToCompare.rightIndex = null;
    } else if (
      state.scenesToCompare.leftIndex == null
      && !state.scenesToCompare.leftInOtherPage
    ) {
      state.scenesToCompare.leftIndex = sceneIndex;
      state.scenesToCompare.leftImage = state.scenes[sceneIndex].image;
    } else if (
      state.scenesToCompare.rightIndex == null
      && !state.scenesToCompare.rightInOtherPage
    ) {
      state.scenesToCompare.rightIndex = sceneIndex;
      state.scenesToCompare.rightImage = state.scenes[sceneIndex].image;
    }

    if (
      state.scenesToCompare.leftIndex != null
      && state.scenesToCompare.rightIndex != null
      && !state.isComparing
    ) {
      state.isComparing = true;
    } else if (
      state.scenesToCompare.leftIndex == null
      && state.scenesToCompare.rightIndex == null
    ) {
      state.isComparing = false;
    }
  },

  setIsComparing(state, payload) {
    state.isComparing = payload;
  },

  clearScenesToCompare(state) {
    state.scenesToCompare = {
      leftIndex: null,
      leftInOtherPage: false,
      rightIndex: null,
      rightInOtherPage: false,
    };
  },

  storeActivePageScenes(state) {
    state.scenes.forEach((scene, index) => {
      if (scene.tmsVisible) {
        state.otherPageScenes.push(scene);

        const newIndex = state.otherPageScenes.length - 1;

        if (
          index === state.scenesToCompare.leftIndex
          && !state.scenesToCompare.leftInOtherPage
          && scene.image === state.scenesToCompare.leftImage
        ) {
          state.scenesToCompare.leftIndex = newIndex;
          state.scenesToCompare.leftInOtherPage = true;
        } else if (
          index === state.scenesToCompare.rightIndex
          && !state.scenesToCompare.rightInOtherPage
          && scene.image === state.scenesToCompare.rightImage
        ) {
          state.scenesToCompare.rightIndex = newIndex;
          state.scenesToCompare.rightInOtherPage = true;
        }
      }
    });
  },

  checkPreviousActiveScenes(state, newPage) {
    const postRemove = [];

    state.otherPageScenes.forEach((oldScene, index) => {
      if (oldScene.page === newPage) {
        const newSceneIndex = state.scenes.findIndex((scene) => scene.image === oldScene.image);

        if (newSceneIndex !== -1) {
          state.scenes[newSceneIndex].tmsVisible = true;

          if (state.scenesToCompare.leftInOtherPage) {
            if (
              state.scenesToCompare.leftIndex === index
              && state.scenes[newSceneIndex].image
              === state.scenesToCompare.leftImage
            ) {
              state.scenesToCompare.leftIndex = newSceneIndex;
              state.scenesToCompare.leftInOtherPage = false;
            }
          }

          if (state.scenesToCompare.rightInOtherPage) {
            if (
              state.scenesToCompare.rightIndex === index
              && state.scenes[newSceneIndex].image
              === state.scenesToCompare.rightImage
            ) {
              state.scenesToCompare.rightIndex = newSceneIndex;
              state.scenesToCompare.rightInOtherPage = false;
            }
          }

          postRemove.push(index);
        }
      }
    });

    state.otherPageScenes = state.otherPageScenes.filter((_, index) => !postRemove.includes(index));

    if (postRemove.length > 0) {
      if (state.scenesToCompare.leftInOtherPage) {
        state.scenesToCompare.leftIndex = state.otherPageScenes.findIndex((otherScene) => (
          otherScene.image
              === state.scenesToCompare.leftImage
        ));
      }
      if (state.scenesToCompare.rightInOtherPage) {
        state.scenesToCompare.rightIndex = state.otherPageScenes.findIndex((otherScene) => (
          otherScene.image
              === state.scenesToCompare.rightImage
        ));
      }
    }
  },

  setShowFilters(state, payload) {
    state.showFilters = payload;
  },
};

export const actions = {
  async getSatellites({ commit }) {
    try {
      const response = await this.$api.$get('catalog/satellite/');

      commit('setSatellites', response);
    } catch (exception) {
      commit(
        'alert/addAlert',
        {
          message: this.$i18n.t('default-error', {
            action: this.$i18n.t('retrieve'),
            resource: this.$i18n.tc('satellite', 2),
          }),
        },
        { root: true },
      );
    }
  },

  async getScenes({ state, commit, rootGetters }, filters) {
    commit('setLoadingScenes', true);
    commit('clearScenes');
    commit('setPage', 1);

    if (filters.currentView) {
      filters.bbox = rootGetters['map/bbox'];
    }

    commit('setFilters', filters);

    const params = {
      start_date: state.filters.startDate,
      end_date: state.filters.endDate,
      max_cloud: state.filters.cloudCover,
      in_bbox: state.filters.bbox,
      satellite: state.filters.satellites
        ? state.filters.satellites.join(',')
        : '',
      page: 1,
    };

    try {
      const response = await this.$api.$get('catalog/', {
        params,
      });
      commit('setSceneCount', response.count);
      commit('setScenes', { scenes: response, page: 1 });
      commit('setShowFeatures', true);
      if (!response) {
        commit(
          'alert/addAlert',
          { message: this.$i18n.t('no-result') },
          { root: true },
        );
      }
    } catch (exception) {
      commit(
        'alert/addAlert',
        {
          message: this.$i18n.t('default-error', {
            action: this.$i18n.t('retrieve'),
            resource: this.$i18n.tc('catalog', 2),
          }),
        },
        { root: true },
      );
    } finally {
      commit('setLoadingScenes', false);
      commit('setShowFilters', false);
    }
  },
  async getTimelineScenes({ state, commit, rootGetters }, params) {
    commit('setLoadingScenes', true);
    try {
      const response = await this.$api.$get('catalog/', {
        params,
      });

      commit('setTimelineScenes', response);
    } catch (exception) {
      commit(
        'alert/addAlert',
        {
          message: this.$i18n.t('default-error', {
            action: this.$i18n.t('retrieve'),
            resource: this.$i18n.tc('catalog', 2),
          }),
        },
        { root: true },
      );
    } finally {
      commit('setLoadingScenes', false);
    }
  },

  async changeScenePage({ state, commit }) {
    commit('setLoadingScenes', true);
    commit('storeActivePageScenes');

    const params = {
      start_date: state.filters.startDate,
      end_date: state.filters.endDate,
      max_cloud: state.filters.cloudCover,
      in_bbox: state.filters.bbox,
      satellite: state.filters.satellites
        ? state.filters.satellites.join(',')
        : '',
      page: state.page,
    };

    try {
      const response = await this.$api.$get('catalog/', {
        params,
      });
      commit('setScenes', { scenes: response.features, page: state.page });
      if (!response.features.length) {
        commit(
          'alert/addAlert',
          { message: this.$i18n.t('no-result') },
          { root: true },
        );
      } else {
        commit('checkPreviousActiveScenes', state.page);
      }
    } catch (exception) {
      commit(
        'alert/addAlert',
        {
          message: this.$i18n.t('default-error', {
            action: this.$i18n.t('retrieve'),
            resource: this.$i18n.tc('catalog', 2),
          }),
        },
        { root: true },
      );
    } finally {
      commit('setLoadingScenes', false);
    }
  },

  async getImagesOnDates({ commit, rootGetters }, filters) {
    const {
      t0, t1, satIds, locator,
    } = filters;

    const catalogFilters = {
      startDate: t0,
      endDate: t1,
      cloudCover: filters.cloudCover || 100,
      satellites: satIds.join(','),
      locator,
      page: 1,
      currentView: filters.currentView,
    };

    commit('setLoadingScenes', true);
    commit('clearScenes');
    commit('setPage', 1);

    if (filters.currentView) {
      catalogFilters.bbox = rootGetters['map/bbox'];
    }

    commit('setFilters', catalogFilters);

    try {
      const response = await this.$api.$get('catalog/images/changes', {
        params: {
          date__in: `${t0},${t1}`,
          locator,
        },
      });

      if (response) {
        commit('setSceneCount', response.count);
        commit('setScenes', { scenes: response, page: 1 });
        commit('setShowFeatures', true);

        if (!response.length) {
          commit(
            'alert/addAlert',
            { message: this.$i18n.t('no-result') },
            { root: true },
          );
        }
      }
    } catch (exception) {
      commit(
        'alert/addAlert',
        {
          message: this.$i18n.t('default-error', {
            action: this.$i18n.t('retrieve'),
            resource: this.$i18n.tc('catalog', 2),
          }),
        },
        { root: true },
      );
    } finally {
      commit('setLoadingScenes', false);
      commit('setShowFilters', false);
    }
  },
};
