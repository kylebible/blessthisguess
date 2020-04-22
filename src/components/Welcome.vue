<template>
  <div>
    <button @click="createRoom" :disabled="userName == ''">
      Create Room
    </button>
    <input type="text" v-model="roomName" maxlength="4" required />
    <input type="text" v-model="userName" required />
    <button @click="joinRoom" :disabled="!canSubmit">Join Room</button>
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

    return { roomName, userName, createRoom, joinRoom, canSubmit };
  },
});
</script>

<style lang="scss"></style>
