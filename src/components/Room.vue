<template>
  <div class="wrapper">
    <b-button type="is-danger" class="leave-room" @click="leaveRoom"
      >Leave Room</b-button
    >
    <div class="room-name">Room Name: {{ roomName }}</div>
    <div class="user-name">UserName: {{ userName }}</div>
    <div class="submit-group">
      <b-field
        class="person"
        label="Submit a Person"
        label-position="on-border"
      >
        <b-input v-model="newSubmittedPerson"> </b-input>
      </b-field>
      <b-button class="submit-button" type="is-primary" @click="submitPerson"
        >Submit</b-button
      >
    </div>
    <div class="player-list">
      <h1>Who's Here?</h1>
      <div v-for="player of players" :key="player.name">
        <span>{{ player.name }}</span>
        <span v-if="player.assignedName && player.name !== userName">{{
          player.assignedName
        }}</span>
        <b-icon icon="check" v-else-if="player.submittedName"></b-icon>
      </div>
      <b-button
        v-if="isCreator"
        :disabled="!isReadyToStart || !isCreator"
        @click="startGame"
        class="start-button"
      >
        Start the game!
      </b-button>
    </div>
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
    const isReadyToStart: Ref<boolean> = computed(() => {
      return players.value.every((player) => player.submittedName ?? false);
    });

    watchEffect(() => {
      players.value = state.playerList;
    });
    watchEffect(() => {
      isCreator.value = state.user.isCreator;
    });

    watchEffect(() => {
      roomName.value = state.room;
    });
    watchEffect(() => {
      userName.value = state.user.name;
    });

    const submitPerson = () => {
      submitSocketPerson(newSubmittedPerson.value);
    };

    const leaveRoom = () => {
      // TODO: Set someone else as creator when creator leaves
      leaveSocketRoom();
    };

    const startGame = () => {
      assignSocketPeople();
    };

    return {
      roomName,
      userName,
      players,
      newSubmittedPerson,
      submitPerson,
      startGame,
      leaveRoom,
      isReadyToStart,
      isCreator,
    };
  },
});
</script>

<style scoped lang="scss">
.wrapper {
  position: relative;
  padding-top: 60px;
  width: 500px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.player-list {
  display: flex;
  flex-direction: column;
  width: 90%;
}
.room-name {
  position: absolute;
  top: 2em;
  right: 1em;
}

.user-name {
  position: absolute;
  top: 2em;
  left: 1em;
}
.leave-room {
  position: absolute !important;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, -50%);
}

.person {
  width: 50%;
}

.submit-group {
  display: flex;
  justify-content: center;
  width: 90%;
  margin-top: 20px;
}
.submit-button {
  margin-left: 10px;
}

h1 {
  font-size: 2em;
}

span {
  font-size: 1.5em;
}
.start-button {
  width: 50%;
  align-self: center;
}
</style>
