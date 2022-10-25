<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="75vw"
    hide-overlay
    transition="dialog-transition"
  >
    <v-card>
      <v-toolbar
        class="background__toolbar"
        dark
        color="primary"
      >
        <h3>Analytics</h3>
        <v-spacer />
        <v-btn
          icon
          @click="closeDialog(false)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container>
        <v-tabs>
          <v-tab>
            <span>
              Tabela
            </span>
          </v-tab>
          <v-tab>Gráfico</v-tab>
          <v-tab-item>
            <v-card>
              <v-container grid-list-xs>
                <v-data-table
                  :headers="headers"
                  :items="desserts"
                  :items-per-page="5"
                  class="elevation-1"
                />
              </v-container>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card>
              <v-container grid-list-xs>
                <div class="mt-2">
                  <v-chip>Terra Indigena</v-chip>
                  <v-chip>Ano</v-chip>
                  <v-chip>Dia</v-chip>
                  <v-chip>Terra Indigena e Ano</v-chip>
                </div>
                <v-divider class="mt-2" />
              </v-container>
              <v-container grid-list-xs>
                <span>teste22222</span>
              </v-container>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'AnalyticalDialog',

  props: {
    value: {
      type: Boolean,
      require: true,
      default: false,
    },
    closeDialog: {
      type: Function,
      require: true,
      default: null,
    },
  },

  data() {
    return {
      dialog: false,
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
      ],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%',
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%',
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%',
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%',
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%',
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%',
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%',
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: '45%',
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: '22%',
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: '6%',
        },
      ],
    };
  },

  mounted() {
    this.dialog = this.value;
  },
};
</script>

<style scoped>
  .v-dialog__content {
    justify-content: flex-start;
  }
</style>
