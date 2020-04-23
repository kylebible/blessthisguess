<template>
  <div class="welcome-wrapper">
    <b-field
      :type="isRoomValid ? '' : 'is-danger'"
      :message="isRoomValid ? '' : roomError"
      label="Room Name"
      label-position="on-border"
    >
      <b-input v-model="roomName" maxlength="30"></b-input>
    </b-field>
    <b-field
      :type="isNameValid ? '' : 'is-danger'"
      :message="isNameValid ? '' : 'Someone already picked that name...'"
      label="Your Name"
      label-position="on-border"
    >
      <b-input v-model="userName" maxlength="12"></b-input>
    </b-field>
    <div class="welcome-buttons">
      <b-button type="is-primary" @click="createRoom" v-show="userName !== ''">Start a Game</b-button>
      <b-button @click="joinRoom" v-show="canSubmit">Join a Game</b-button>
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
  Ref
} from "@vue/composition-api";
import { useSockets } from "@/services/sockets";
import { useStore } from "@/features/store";

export default defineComponent({
  setup(props, context: SetupContext) {
    const {
      setUserName,
      setIsCreator,
      setRoom,
      setPlayerList,
      state
    } = useStore();
    const roomName = ref("");
    const isRoomValid = ref(true);
    const roomError = ref("");
    const isNameValid = ref(true);
    const userName = ref(state.user.name);
    const canSubmit: Ref<boolean> = computed(() => {
      return roomName.value !== "" && userName.value !== "";
    });
    const { joinSocketRoom } = useSockets();

    onMounted(() => {
      if (context.root.$route.params.roomName) {
        roomName.value = context.root.$route.params.roomName;
      }
    });

    function createRoom() {
      setUserName(userName.value);
      setIsCreator(true);
      joinSocketRoom(roomName.value, userName.value, true)
        .then(({ room, allPlayers }) => {
          isNameValid.value = true;
          isRoomValid.value = true;
          setRoom(room);
          setPlayerList(allPlayers);
        })
        .catch(error => {
          if (error === "Duplicate Room Name") {
            isRoomValid.value = false;
            roomError.value = "That room name is taken";
          }
        });
    }

    function joinRoom() {
      setUserName(userName.value);
      setIsCreator(false);
      joinSocketRoom(roomName.value, userName.value, false)
        .then(({ room, allPlayers }) => {
          isNameValid.value = true;
          isRoomValid.value = true;
          setRoom(room);
          setPlayerList(allPlayers);
        })
        .catch(error => {
          if (error === "Duplicate Player Name") {
            isNameValid.value = false;
          } else if (error === "Room Does Not Exist") {
            isRoomValid.value = false;
            roomError.value = "That room hasn't been created yet";
          }
        });
    }

    function upperCaseRoom() {
      roomName.value = roomName.value.toUpperCase();
    }

    return {
      roomName,
      isRoomValid,
      roomError,
      userName,
      isNameValid,
      createRoom,
      joinRoom,
      canSubmit,
      upperCaseRoom
    };
  }
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
