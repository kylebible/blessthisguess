import User from "@/models/user";
import plugin from "@vue/composition-api";
import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export interface RootState {
  room: string;
  user: User;
  playerList: User[];
}

const store: StoreOptions<RootState> = {
  state: {
    room: "",
    user: {
      name: "",
      isCreator: false,
    },
    playerList: [],
  },
  mutations: {
    setRoom(state: RootState, room: string) {
      state.room = room;
    },
    setUserName(state: RootState, name: string) {
      state.user.name = name;
    },
    setIsCreator(state: RootState, value: boolean) {
      state.user.isCreator = value;
    },
    setPlayerList(state: RootState, playerList: User[]) {
      state.playerList = playerList;
    },
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
};

export default new Vuex.Store<RootState>(store);
