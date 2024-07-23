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
  // async getUserData({ commit, dispatch }) {
  //   await this.$api.$get('user/logged/').then((data) => {
  //     commit('setUser', {
  //       user: data,
  //     });
  //   }).catch((error) => {
  //     console.error('Erro ao receber dados:', error);
  //     dispatch('auth/logout', null, { root: true });
  //   });
  // },
  
  getUserData({ commit }) {
    // return await this.$api.$get('user-profile/logged').then((data) => {
    //     commit('setUser', {
    //         user: data,
    //     })
    // })
    commit('setUser', {
      user: {
        email: 'root@hex360.com.br',
        first_name: 'Usuario',
        id: 1,
        last_name: 'Teste',
        username: 'root',
        settings: {
          map_zoom_buttons_visible: true,
          drawer_open_on_init: true,
          map_search_button_visible: true,
          map_scale_visible: true,
          minimap_visible: true,
          map_pointer_coordinates_visible: true,
        },
      },
    });
  },
};
