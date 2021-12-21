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
export { default as ChangeDetectionFilter } from '../../components/change-detection/ChangeDetectionFilter.vue'
export { default as ChangeDetectionLayers } from '../../components/change-detection/ChangeDetectionLayers.vue'
export { default as ChangeDetectionList } from '../../components/change-detection/ChangeDetectionList.vue'
export { default as ChangeDetectionListItem } from '../../components/change-detection/ChangeDetectionListItem.vue'
export { default as ConfirmButton } from '../../components/confirmButton/ConfirmButton.vue'
export { default as ImageryFilter } from '../../components/imagery/ImageryFilter.vue'
export { default as ImageryLayers } from '../../components/imagery/ImageryLayers.vue'
export { default as ImagerySceneImages } from '../../components/imagery/ImagerySceneImages.vue'
export { default as ImagerySceneImagesCompositionActions } from '../../components/imagery/ImagerySceneImagesCompositionActions.vue'
export { default as ImagerySceneList } from '../../components/imagery/ImagerySceneList.vue'
export { default as ImagerySceneListItem } from '../../components/imagery/ImagerySceneListItem.vue'
export { default as ImagerySceneListItemActions } from '../../components/imagery/ImagerySceneListItemActions.vue'
export { default as ImagerySceneListItemCard } from '../../components/imagery/ImagerySceneListItemCard.vue'
export { default as Map } from '../../components/map/Map.vue'
export { default as Map2 } from '../../components/map/Map2.vue'
export { default as MapSearch } from '../../components/map/MapSearch.vue'
export { default as MapZoomToCoords } from '../../components/map/ZoomToCoords.vue'
export { default as MonitoringLayers } from '../../components/monitoring/MonitoringLayers.vue'
export { default as MonitoringLayersGeoserver } from '../../components/monitoring/MonitoringLayersGeoserver.vue'
export { default as ProfileMapViewBox } from '../../components/profile/MapViewBox.vue'
export { default as ProfileLeafletMap } from '../../components/profile/ProfileLeafletMap.vue'
export { default as ProfilePanel } from '../../components/profile/ProfilePanel.vue'
export { default as ProfilePanelPassword } from '../../components/profile/ProfilePanelPassword.vue'
export { default as ProfilePanelSettings } from '../../components/profile/ProfilePanelSettings.vue'
export { default as ProfilePanelSettingsMap } from '../../components/profile/ProfilePanelSettingsMap.vue'
export { default as SupportLayerFilters } from '../../components/support/SupportLayerFilters.vue'
export { default as SupportLayerItem } from '../../components/support/SupportLayerItem.vue'
export { default as SupportLayers } from '../../components/support/SupportLayers.vue'
export { default as SupportLayersGroup } from '../../components/support/SupportLayersGroup.vue'
export { default as SupportLayersGroupItem } from '../../components/support/SupportLayersGroupItem.vue'
export { default as MapFileLoaderControl } from '../../components/map/file-loader/FileLoaderControl.vue'
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
