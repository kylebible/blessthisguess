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
        <b-input :placeholder="personPlaceholder" v-model="newSubmittedPerson">
        </b-input>
      </b-field>
      <b-button class="submit-button" type="is-primary" @click="submitPerson"
        >Submit</b-button
      >
    </div>
    <div class="player-list">
      <h1>Who's Here?</h1>
      <div v-for="player of players" :key="player.name" class="player-item">
        <b-icon
          icon="star"
          :style="{ visibility: player.isCreator ? 'visible' : 'hidden' }"
        ></b-icon>
        <span class="player-name">{{ player.name }}</span>
        <span v-if="!player.submittedName" class="waiting"
          >waiting to submit a name...</span
        >
        <b-icon
          type="is-success"
          icon="check"
          v-else-if="player.submittedName && !player.assignedName"
        ></b-icon>
        <span v-else-if="player.assignedName && player.name !== userName">{{
          player.assignedName
        }}</span>
      </div>
      <b-button
        v-if="isCreator && isReadyToAssign && players.length >= 2"
        @click="assignPeople"
        class="assign-button"
      >
        Assign People!
      </b-button>
      <span v-if="players.length === 1">Waiting on another player...</span>
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
    const examplePeople = ["Santa", "Queen Elizabeth", "Brad Pitt", "Batman"];
    const personPlaceholder = ref("");
    const newSubmittedPerson = ref("");
    const {
      submitSocketPerson,
      leaveSocketRoom,
      assignSocketPeople,
    } = useSockets();
    const isReadyToAssign: Ref<boolean> = computed(() => {
      return players.value.every((player) => player.submittedName ?? false);
    });

    onMounted(() => {
      let index = 0;
      setInterval(() => {
        personPlaceholder.value = examplePeople[index % examplePeople.length];
        index++;
      }, 2000);
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
      personPlaceholder,
    };
  },
});
</script>

<style scoped lang="scss">
.wrapper {
  position: relative;
  padding-top: 60px;
  padding: 60px 30px 0 30px;
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
  justify-content: flex-start;
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
  margin: 5px;
  overflow: hidden;
  white-space: nowrap;
}

.player-name {
  font-size: 1.5em;
  width: 50%;
}

.waiting {
  font-size: 1em;
  opacity: 0.5;
  width: 50%;
}
.assign-button {
  width: 50%;
  align-self: center;
  margin-top: 20px;
}
.player-item {
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid lighten(gray, 20%);
}
</style>
