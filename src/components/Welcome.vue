<template>
  <div class="welcome-wrapper">
    <b-field label="Room Name" label-position="on-border">
      <b-input v-model="roomName" maxlength="4" @input="upperCaseRoom">
      </b-input>
    </b-field>
    <b-field label="Your Name" label-position="on-border">
      <b-input v-model="userName"></b-input>
    </b-field>
    <div class="welcome-buttons">
      <b-button
        type="is-primary"
        @click="createRoom"
        :disabled="userName == ''"
      >
        Create Room
      </b-button>
      <b-button @click="joinRoom" :disabled="!canSubmit">Join Room</b-button>
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
} from "@vue/composition-api";
import { useSockets } from "@/services/sockets";
import { useStore } from "@/features/store";

export default defineComponent({
  setup(props, context: SetupContext) {
    const { setUserName, setIsCreator, state } = useStore();
    const roomName = ref("");
    const userName = ref(state.user.name);
    const canSubmit: Ref<boolean> = computed(() => {
      return roomName.value !== "" && userName.value !== "";
    });
    const { joinSocketRoom, createSocketRoom } = useSockets();

    function createRoom() {
      setUserName(userName.value);
      setIsCreator(true);
      createSocketRoom(userName.value);
    }

    function joinRoom() {
      setUserName(userName.value);
      setIsCreator(false);
      joinSocketRoom(roomName.value, userName.value);
    }

    function upperCaseRoom() {
      roomName.value = roomName.value.toUpperCase();
    }

    return {
      roomName,
      userName,
      createRoom,
      joinRoom,
      canSubmit,
      upperCaseRoom,
    };
  },
});
</script>

<style lang="scss">
.welcome-wrapper {
  margin-top: 60px;
  width: 300px;
}
.welcome-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
</style>
