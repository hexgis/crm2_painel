export { default as BaseAlert } from '../../components/base/BaseAlert.vue'
export { default as BaseDateField } from '../../components/base/BaseDateField.vue'
export { default as BaseExpandableTitle } from '../../components/base/BaseExpandableTitle.vue'
export { default as BaseMetadataModal } from '../../components/base/BaseMetadataModal.vue'
export { default as BaseMetadataPopup } from '../../components/base/BaseMetadataPopup.vue'
export { default as BaseWmsMetadataPopup } from '../../components/base/BaseWmsMetadataPopup.vue'
export { default as CatalogFilter } from '../../components/catalog/CatalogFilter.vue'
export { default as CatalogLayers } from '../../components/catalog/CatalogLayers.vue'
export { default as CatalogSceneList } from '../../components/catalog/CatalogSceneList.vue'
export { default as CatalogSceneListItem } from '../../components/catalog/CatalogSceneListItem.vue'
export { default as ConfirmButton } from '../../components/confirmButton/ConfirmButton.vue'
export { default as ProfileMapViewBox } from '../../components/profile/MapViewBox.vue'
export { default as ProfileLeafletMap } from '../../components/profile/ProfileLeafletMap.vue'
export { default as ProfilePanel } from '../../components/profile/ProfilePanel.vue'
export { default as ProfilePanelPassword } from '../../components/profile/ProfilePanelPassword.vue'
export { default as ProfilePanelSettings } from '../../components/profile/ProfilePanelSettings.vue'
export { default as ProfilePanelSettingsMap } from '../../components/profile/ProfilePanelSettingsMap.vue'
export { default as SupportLayerItem } from '../../components/support/SupportLayerItem.vue'
export { default as SupportLayers } from '../../components/support/SupportLayers.vue'
export { default as SupportLayersGroup } from '../../components/support/SupportLayersGroup.vue'
export { default as SupportLayersGroupItem } from '../../components/support/SupportLayersGroupItem.vue'
export { default as Map } from '../../components/map/Map.vue'
export { default as Map2 } from '../../components/map/Map2.vue'
export { default as MapFileLoaderLayers } from '../../components/map/file-loader/FileLoaderLayers.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
