<template>
  <div class="popup popup-width-400">
    <div class="popup-header">{{ tiName }}</div>
    <div class="popup-tabs">
      <div class="popup-content">
        <div class="popup-item" v-for="(feature, index) in data.features" :key="index">
          <div class="popup-table-wrapper">
            <table class="popup-table">
              <tbody>
                <tr v-for="(value, key) in feature.properties" :key="key">
                  <td><strong>{{ formatField(key) }}:</strong></td>
                  <td>{{ value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tiName: String,
    data: Object
  },
  methods: {
    formatField(field) {
      const replacements = {
        dt_: ['Data ', 'dt_'],
        co_: ['Codigo ', 'co_'],
        cd_: ['Codigo ', 'cd_'],
        sg_: ['Sigla ', 'sg_'],
        ds_: ['Descrição ', 'ds_'],
        no_: ['Nome ', 'no_'],
        possui_: ['Possui Inst. de Gestão', 'possui_ig'],
        ranking: ['Ranking Desmate 2022', 'ranking']
      };

      const prefix = field.match(/^\w+_/) ? field.match(/^\w+_/)[0] : field.match(/^\w+/)[0];
      const key = prefix.slice(0, -1); // Remove o underscore do final
      const regex = /^[A-Za-z]{2}_\w+$/;

      if (key in replacements) {
        field = field.replace(replacements[key][1], replacements[key][0]);
      } else if (field.match(regex)) {
        field = field.substring(3);
      }

      field = field
        .replaceAll('_', ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return field;
    }
  }
};
</script>

<style lang="sass">
.popup-header
  height: 50px
  padding-top: 25px
  font-size: 20px

.popup-table-wrapper
  max-height: 300px
  width: 400px
  overflow-y: auto
  padding-top: 25px

.popup-table
  border-collapse: collapse
  padding-top: 25px

.popup-table td, .popup-table th
  border-bottom: 1px solid #dddddd
  padding: 8px

.popup-table tr:hover
  background-color: #dddddd
</style>
