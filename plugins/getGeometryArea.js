function roundValue(num, len) {
    return Math.round(num * 10 ** len) / 10 ** len
}

function strLatLng(latlng) {
    return `${roundValue(latlng.lat, 6)}, ${roundValue(latlng.lng, 6)}`
}

function getGeometryArea(layer) {
    // Circle - lat/long, radius
    if (layer instanceof L.Circle) {
        const center = layer.getLatLng()
        const radius = layer.getRadius()

        return {
            position: strLatLng(center),
            radius: roundValue(radius, 2),
        }
    }
    // Marker - add lat/long
    if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        return { position: strLatLng(layer.getLatLng()) }
    }
    // Rectangle/Polygon - area
    if (layer instanceof L.Polygon) {
        const latlngs = layer._defaultShape
            ? // method name is defined in plugin
              layer._defaultShape()
            : layer.getLatLngs()
        const area = L.GeometryUtil.geodesicArea(latlngs)
        return {
            area: L.GeometryUtil.readableArea(area, true),
        }
    }
    // Polyline - distance
    if (layer instanceof L.Polyline) {
        const latlngs = layer._defaultShape
            ? // method name is defined in plugin
              layer._defaultShape()
            : layer.getLatLngs()
        let distance = 0
        if (latlngs.length < 2) {
            return 'N/A'
        }
        for (let i = 0; i < latlngs.length - 1; i += 1) {
            distance += latlngs[i].distanceTo(latlngs[i + 1])
        }
        return { distance: roundValue(distance, 2) }
    }
    return null
}

export default getGeometryArea
