<template>
  <div>
    <button @click="leaveRoom">Leave Room</button>
    <div>Room Name: {{ roomName }}</div>
    <div>UserName: {{ userName }}</div>
    <input type="text" v-model="newSubmittedPerson" />
    <button @click="submitPerson">Submit</button>
    <div class="player-list">
      <h1>Players</h1>
      <div v-for="player of players" :key="player.name">
        <span>{{ player.name }}</span>
        <span v-if="player.assignedName && player.name !== userName">{{
          player.assignedName
        }}</span>
        <span v-else-if="player.submittedName">x</span>
      </div>
    </div>
    <button :disabled="!isReadyToAssign || !isCreator" @click="assignPeople">
      Assign
    </button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  onMounted,
  ref,
  computed,
  Ref,
  watch,
  watchEffect,
} from "@vue/composition-api";
import { useSockets } from "@/services/sockets";
import { useStore } from "@/features/store";

export default defineComponent({
  setup(props, context: SetupContext) {
    const { state } = useStore();
    const roomName = ref(state.room);
    const userName = ref(state.user.name);
    const players = ref(state.playerList);
    const isCreator = ref(state.user.isCreator);
    const newSubmittedPerson = ref("");
    const {
      submitSocketPerson,
      leaveSocketRoom,
      assignSocketPeople,
    } = useSockets();
    const isReadyToAssign: Ref<boolean> = computed(() => {
      return players.value.every((player) => player.submittedName ?? false);
    });

    watchEffect(() => {
      players.value = state.playerList;
      isCreator.value = state.user.isCreator;
    });

    const submitPerson = () => {
      submitSocketPerson(newSubmittedPerson.value);
    };

    const leaveRoom = () => {
      // TODO: Set someone else as creator when creator leaves
      leaveSocketRoom();
    };

    const assignPeople = () => {
      assignSocketPeople();
    };

    return {
      roomName,
      userName,
      players,
      newSubmittedPerson,
      submitPerson,
      assignPeople,
      leaveRoom,
      isReadyToAssign,
      isCreator,
    };
  },
});
</script>

<style lang="scss">
.player-list {
  display: flex;
  flex-direction: column;
}
</style>
