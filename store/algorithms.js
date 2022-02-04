export const state = () => ({
    layers: [
        {
            name: 'Identificar Aeronave',
            layer: '',
            visible: false,
        },
        {
            name: 'Identificar Embarcação',
            layer: '',
            visible: false,
        },
        {
            name: 'Identificar Veículo',
            layer: '',
            visible: false,
        },
        {
            name: 'Identificar Blindado',
            layer: '',
            visible: false,
        },
        {
            name: 'Identificar Concentrações Humanas',
            layer: '',
            visible: false,
        },
        {
            name: 'Identificar Edificação',
            layer: '',
            visible: false,
        },
        {
            name: 'Identificar Gado Confinado',
            layer: '',
            visible: false,
        },
        {
            name: 'Identificar Estrada',
            layer: '',
            visible: false,
        },
        {
            name: 'Identificar Garimpo',
            layer: '',
            visible: false,
        },
        {
            name: 'Identificar Uso Agropecuário',
            layer: '',
            visible: false,
        },
        {
            name: 'Identificar Silo',
            layer: '',
            visible: false,
        },
        {
            name: 'Identificar Foco Noturno de Luz',
            layer: '',
            visible: false,
        },
        {
            name: 'Identificar Cicatriz de Incêndio',
            layer: '',
            visible: false,
        },
        {
            name: 'Identificar Corte Raso',
            layer: '',
            visible: false,
        },
        {
            name: 'Identificar Degradação',
            layer: '',
            visible: false,
        },
        {
            name: 'Identificar Degradação em Regeneração',
            layer: '',
            visible: false,
        },
        {
            name: 'Identificar Mancha de Óleo',
            layer: '',
            visible: false,
        },
    ],
})

export const mutations = {
    toggleLayerVisibility(state, { id, visible }) {
        state.layers[id].visible = visible
    },
}
