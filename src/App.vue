<template>
  <div id="app">
    <welcome v-if="!hasRoom"></welcome>
    <room v-else></room>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  onMounted,
  ref,
  computed
} from "@vue/composition-api";
import Welcome from "@/components/Welcome.vue";
import Room from "@/components/Room.vue";
import { useStore } from "./features/store";

export default defineComponent({
  components: { Welcome, Room },
  setup(props, context: SetupContext) {
    const { state } = useStore();
    const hasRoom = computed(() => {
      return !!state.room;
    });

    return { hasRoom };
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
