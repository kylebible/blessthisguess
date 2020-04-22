import User from "@/models/user";
import store from "@/store";

export function useStore() {
  const state = store.state;

  function setRoom(room: string) {
    store.commit("setRoom", room);
  }

  function setUserName(name: string) {
    store.commit("setUserName", name);
  }

  function setPlayerList(playerList: User[]) {
    store.commit("setPlayerList", playerList);
  }

  function setIsCreator(value: boolean) {
    store.commit("setIsCreator", value);
  }

  return {
    state,
    setRoom,
    setUserName,
    setPlayerList,
    setIsCreator,
  };
}
