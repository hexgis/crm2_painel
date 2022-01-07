<template>
  <FiltersPriority />
</template>

<script>
import { mapState } from "vuex";
import _ from "lodash";

import FiltersPriority from "@/components/filters/PriorityFilter.vue";

export default {
  name: "Monitoring",

  components: { FiltersPriority },
};
</script>
