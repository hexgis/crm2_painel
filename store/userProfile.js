export const state = () => ({
  user: null,
  showDrawer: false,
});

export const mutations = {
  setUser(state, { user }) {
    state.user = user;
  },
  closeDrawer(state) {
    state.showDrawer = false;
  },
  openDrawer(state) {
    state.showDrawer = true;
  },
};

export const actions = {
  async getUserData({ commit, dispatch }) {
    await this.$api.$get('user/logged/').then((data) => {
      commit('setUser', {
        user: data,
      });
    }).catch((error) => {
      console.error('Erro ao receber dados:', error);
      dispatch('auth/logout', null, { root: true });
    });
  },
};