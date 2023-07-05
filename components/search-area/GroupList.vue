<template>
    <v-list-group v-if="group" :value="true">
        <template #activator>
            <v-list-item-content>
                <v-list-item-title class="text-wrap">
                    <span class="text-cursor">
                        {{ group.name }}
                    </span>
                </v-list-item-title>
            </v-list-item-content>
        </template>
        <v-container class="py-0">
            <v-list expand>
                <template v-for="layer in group.layers">
                    <LayerList
                        v-if="layer.display"
                        :key="layer.id"
                        :layer="layer"
                        :groupId="group.id"
                    />
                </template>
            </v-list>
        </v-container>

        <v-divider />
    </v-list-group>
</template>
<script>
import LayerList from '@/components/search-area/LayerList'

export default {
    props: {
        group: {
            type: Object,
            required: true,
        },
    },
    components: {
        LayerList,
    },
}
</script>