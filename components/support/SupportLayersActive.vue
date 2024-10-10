<template>
  <v-list-group>
    <template #activator>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          <span class="text-cursor">
            {{ $t('title') }}
          </span>
        </v-list-item-title>
      </v-list-item-content>
    </template>
    <v-container class="py-0 my-0">
      <template v-if="Object.keys(supportLayerUser).length">
        <v-list expand>
          <draggable v-bind="dragOptions" v-model="concatenatedLayers" @change="onDragChange">
          <template v-for="layer in concatenatedLayers">
              <v-row :key="layer.id" v-if="layer.visible" no-gutters align="center" class="image-container">
                <img v-if="layer.wms" :src="layer.wms.geoserver.preview_url + layer.wms.geoserver_layer_name" class="layer-thumbnail" alt="CorLayer">
                <v-icon v-else style="font-size: 40px;" class="mr-2" :color="layer.properties?.color || layer.color">
                  mdi-square
                </v-icon>
                <span class="ml-1">
                  <p>{{ layer.name }}</p>
                </span>
              </v-row>
            </template>
          </draggable>
        </v-list>
      </template>
      <template v-else>
        <div class="text-layer">
          {{ $t('text-layer') }}
        </div>
      </template>
    </v-container>
    <v-divider />
  </v-list-group>
</template>
<i18n>
  {
      "en": {
          "title": "Active Layers",
          "text-layer":"Layers can be added to the 'User Layers' group by drawing a polygon with the drawing tool and subsequently saving it as a new layer. Alternatively, an external file can be uploaded through the 'Upload a File' option. Both functionalities are avaiable in the left sidebar menu."
      },
      "pt-br": {
          "title": "Camadas Ativas",
          "text-layer":"Para adicionar camadas ao grupo 'Camadas do Usuário', desenhe um polígono utilizando a ferramenta de desenho e, em seguida, salve como uma nova camada. Alternativamente, é possível também carregar um arquivo externo por meio da opção 'Carregar um Arquivo'. Ambas funcionalidades estão disponíveis no menu lateral esquerdo."
      }
  }
  </i18n>
<script>
import draggable from 'vuedraggable';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'SupportUser',

  components: { draggable },

  async fetch() {
    if (!Object.keys(this.supportLayerUser).length && this.user) {
      await this.$store.dispatch('supportLayersUser/getLayersUser');
    }
  },
  data() {
    return {
      concatenatedLayers: [],
    };
  },
  computed: {
    ...mapState('supportLayersUser', ['supportLayerUser']),
    ...mapState('map', ['hasAddLayer']),
    ...mapState('userProfile', ['user']),
    ...mapState('map', ['bounds']),
    ...mapState('supportLayers', [
      'showFeaturesSupportLayers',
      'supportLayers',
    ]),
    ...mapState('monitoring', ['selectedStages', 'showFeaturesMonitoring']),
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    }
  },
  watch: {
    hasAddLayer: {
      deep: true,
      handler(newLayer) {
        if (newLayer) {
          this.getInfo();
        }
      },
    },
    supportLayers: {
      handler: 'updateConcatenatedLayers',
      deep: true,
    },
    supportLayerUser: {
      handler: 'updateConcatenatedLayers',
      deep: true,
    },
    activeMonitoringLabel: {
      handler: 'updateConcatenatedLayers',
      deep: true,
    }
  },
  created() {
    this.getInfo();
    this.updateConcatenatedLayers();
  },
  methods: {
    async getInfo() {
      await this.$store.dispatch('supportLayersUser/getLayersUser');
      this.setHasLayer(false);
    },
    ...mapMutations('map', ['setHasLayer']),

    updateConcatenatedLayers() {
      const visibleSupportLayers = this.supportLayers ? Object.values(this.supportLayers).filter(layer => layer.visible) : [];
      const visibleSupportLayerUser = this.supportLayerUser ? Object.values(this.supportLayerUser).filter(layer => layer.visible) : [];
      const visibleActiveMonitoring = this.activeMonitoringLabel ? Object.values(this.activeMonitoringLabel).filter(layer => layer.visible) : [];

      this.concatenatedLayers = [
        ...visibleSupportLayers,
        ...visibleSupportLayerUser,
        ...visibleActiveMonitoring
      ];

    },

    onDragChange(event) {
      console.log('Nova ordem:', this.concatenatedLayers.map((layer)=> layer.name));
    }
  }
};
</script>

<style scoped lang="sass">
.text-layer
  font-size: 12px
  padding: 6px
  margin-left: 4px
  margin-right: 6px
  margin-bottom: 4px
  text-align: justify
  background: #d7dae766

.image-container
  cursor: move

.v-application p
  margin-bottom: 0
</style>
