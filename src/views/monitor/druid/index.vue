<template>
  <elFrame :src="sqlApi" />
</template>
<script>
import { mapGetters } from 'vuex'
import elFrame from '@/components/Iframe'
export default {
  name: 'Druid',
  components: { elFrame },
  computed: {
    ...mapGetters([
      'sqlApi'
    ])
  }
}
</script>
