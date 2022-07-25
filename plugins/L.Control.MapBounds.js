L.Control.MapBounds = L.Control.extend({
    // Defaults
    options: {
        type: 'northeast',
        position: 'topright',
        template: '{y} | {x}',
        latlngFormat: 'DD', // DD, DM, DMS
        latlngDesignators: false,
        latLngFormatter: undefined,
    },

    onAdd: function (map) {
        switch (this.options.type) {
            case 'northeast':
                this.options.position = 'topright'
                break
            case 'southeast':
                this.options.position = 'bottomright'
                break
            case 'northwest':
                this.options.position = 'topleft'
                break
            case 'southwest':
                this.options.position = 'bottomleft'
                break
            case 'center':
                this.options.position = 'bottomleft'
                break
        }

        // Control container
        this._container = L.DomUtil.create('div', 'leaflet-control-mapbounds')
        L.DomEvent.disableClickPropagation(this._container)

        // Add events listeners for updating coordinates
        map.on('move', this._onMapMove, this)
        map.on('moveend', this._onMapMoveEnd, this)

        this._container.innerHTML = this._getMapBounds()
        return this._container
    },

    onRemove: function (map) {
        map.off('move', this._onMapMove, this)
        map.off('moveend', this._onMapMove, this)
    },

    _onMapMove: function (e) {
        this._container.innerHTML = this._getMapBounds()
    },

    _onMapMoveEnd: function (e) {
        this._container.innerHTML = this._getMapBounds()
    },

    _getMapBounds: function () {
        var mapBounds = this._map.getBounds()
        var targetBounds

        switch (this.options.type) {
            case 'northeast':
                targetBounds = mapBounds.getNorthEast()
                break
            case 'southeast':
                targetBounds = mapBounds.getSouthEast()
                break
            case 'northwest':
                targetBounds = mapBounds.getNorthWest()
                break
            case 'southwest':
                targetBounds = mapBounds.getSouthWest()
                break
            case 'center':
                targetBounds = this._map.getCenter()
                break
        }

        return this._getLatLngCoord(targetBounds)
    },

    _getLatLngCoord: function (bound) {
        if (this.options.latLngFormatter != undefined)
            return this.options.latLngFormatter(center.lat, center.lng)

        var lat, lng, deg, min

        //make a copy of bound so we aren't affecting leaflet's internal state
        var boundCopy = {
            lat: bound.lat,
            lng: bound.lng,
        }

        // 180 degrees & negative
        if (boundCopy.lng < 0) {
            boundCopy.lng_neg = true
            boundCopy.lng = Math.abs(boundCopy.lng)
        } else boundCopy.lng_neg = false
        if (boundCopy.lat < 0) {
            boundCopy.lat_neg = true
            boundCopy.lat = Math.abs(boundCopy.lat)
        } else boundCopy.lat_neg = false
        if (boundCopy.lng > 180) {
            boundCopy.lng = 360 - boundCopy.lng
            boundCopy.lng_neg = !boundCopy.lng_neg
        }

        // format
        if (this.options.latlngFormat === 'DM') {
            deg = parseInt(boundCopy.lng)
            lng =
                deg +
                'º ' +
                this._format('00.000', (boundCopy.lng - deg) * 60) +
                "'"
            deg = parseInt(boundCopy.lat)
            lat =
                deg +
                'º ' +
                this._format('00.000', (boundCopy.lat - deg) * 60) +
                "'"
        } else if (this.options.latlngFormat === 'DMS') {
            deg = parseInt(boundCopy.lng)
            min = (boundCopy.lng - deg) * 60
            lng =
                deg +
                'º ' +
                this._format('00', parseInt(min)) +
                "' " +
                this._format('00.0', (min - parseInt(min)) * 60) +
                "''"
            deg = parseInt(boundCopy.lat)
            min = (boundCopy.lat - deg) * 60
            lat =
                deg +
                'º ' +
                this._format('00', parseInt(min)) +
                "' " +
                this._format('00.0', (min - parseInt(min)) * 60) +
                "''"
        } else {
            // 'DD'
            lng = this._format('#0.00000', boundCopy.lng) + 'º'
            lat = this._format('##0.00000', boundCopy.lat) + 'º'
        }

        return L.Util.template(this.options.template, {
            x:
                (!this.options.latlngDesignators && boundCopy.lng_neg
                    ? '-'
                    : '') +
                lng +
                (this.options.latlngDesignators
                    ? boundCopy.lng_neg
                        ? ' W'
                        : ' E'
                    : ''),
            y:
                (!this.options.latlngDesignators && boundCopy.lat_neg
                    ? '-'
                    : '') +
                lat +
                (this.options.latlngDesignators
                    ? boundCopy.lat_neg
                        ? ' S'
                        : ' N'
                    : ''),
        })
    },

    /*
     IntegraXor Web SCADA - JavaScript Number Formatter
     https://code.google.com/p/javascript-number-formatter/
     author: KPL, KHL
    */
    _format: function (m, v) {
        if (!m || isNaN(+v)) {
            return v //return as it is.
        }
        //convert any string to number according to formation sign.
        var v = m.charAt(0) == '-' ? -v : +v
        var isNegative = v < 0 ? (v = -v) : 0 //process only abs(), and turn on flag.

        //search for separator for grp & decimal, anything not digit, not +/- sign, not #.
        var result = m.match(/[^\d\-\+#]/g)
        var Decimal = (result && result[result.length - 1]) || '.' //treat the right most symbol as decimal
        var Group = (result && result[1] && result[0]) || ',' //treat the left most symbol as group separator

        //split the decimal for the format string if any.
        var m = m.split(Decimal)
        //Fix the decimal first, toFixed will auto fill trailing zero.
        v = v.toFixed(m[1] && m[1].length)
        v = +v + '' //convert number to string to trim off *all* trailing decimal zero(es)

        //fill back any trailing zero according to format
        var pos_trail_zero = m[1] && m[1].lastIndexOf('0') //look for last zero in format
        var part = v.split('.')
        //integer will get !part[1]
        if (!part[1] || (part[1] && part[1].length <= pos_trail_zero)) {
            v = (+v).toFixed(pos_trail_zero + 1)
        }
        var szSep = m[0].split(Group) //look for separator
        m[0] = szSep.join('') //join back without separator for counting the pos of any leading 0.

        var pos_lead_zero = m[0] && m[0].indexOf('0')
        if (pos_lead_zero > -1) {
            while (part[0].length < m[0].length - pos_lead_zero) {
                part[0] = '0' + part[0]
            }
        } else if (+part[0] == 0) {
            part[0] = ''
        }

        v = v.split('.')
        v[0] = part[0]

        //process the first group separator from decimal (.) only, the rest ignore.
        //get the length of the last slice of split result.
        var pos_separator = szSep[1] && szSep[szSep.length - 1].length
        if (pos_separator) {
            var integer = v[0]
            var str = ''
            var offset = integer.length % pos_separator
            for (var i = 0, l = integer.length; i < l; i++) {
                str += integer.charAt(i) //ie6 only support charAt for sz.
                //-pos_separator so that won't trail separator on full length
                if (
                    !((i - offset + 1) % pos_separator) &&
                    i < l - pos_separator
                ) {
                    str += Group
                }
            }
            v[0] = str
        }

        v[1] = m[1] && v[1] ? Decimal + v[1] : ''
        return (isNegative ? '-' : '') + v[0] + v[1] //put back any negation and combine integer and fraction.
    },
})

L.Map.mergeOptions({
    MapBoundsControl: false,
})

L.Map.addInitHook(function () {
    if (this.options.MapBoundsControl) {
        this.MapBoundsControl = new L.Control.MapBounds()
        this.addControl(this.MapBoundsControl)
    }
})

L.control.mapBounds = function (options) {
    return new L.Control.MapBounds(options)
}
