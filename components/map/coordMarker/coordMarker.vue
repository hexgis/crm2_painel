<template>
    <div>
      
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="lat"
                  placeholder="-8.62065"
                  class="decimal-field"
                  :class="latError"
                  suffix="°"
                  solo
                  flat
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <span>Latitude</span>
            </v-tooltip>
        <span class="separator" />
        <v-tooltip
              top
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  
                  v-model="lng"
                  class="decimal-field"
                  :class="lngError"
                  placeholder="-53.32244"
                  suffix="°"
                  solo
                  flat
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <span>Longitude</span>
            </v-tooltip>
            
  
        
    </div>
</template>



<style lang="sass">
.separator
    padding-right: 20px

.decimal-field
    width: 105px
</style>