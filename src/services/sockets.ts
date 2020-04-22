import { useStore } from "@/features/store";
import User from "@/models/user";
import io from "socket.io-client";

export function useSockets() {
  const { state, setRoom, setUserName, setPlayerList } = useStore();
  const socket = io("localhost:4000");

  const joinSocketRoom = (roomName: string, userName: string) => {
    socket.emit(
      "JOIN_ROOM",
      { roomName: roomName.toUpperCase(), userName },
      (success: boolean, allPlayers: User[], error: string) => {
        if (success) {
          setRoom(roomName);
          setPlayerList(allPlayers);
        } else {
          // send validation feedback at some point
          //   console.error(error);
        }
      }
    );
  };

  const createSocketRoom = (userName: string) => {
    socket.emit(
      "CREATE_ROOM",
      userName,
      (roomName: string, allPlayers: User[]) => {
        setRoom(roomName);
        setPlayerList(allPlayers);
      }
    );
  };

  const leaveSocketRoom = () => {
    socket.emit("LEAVE_ROOM", {
      userName: state.user.name,
      roomName: state.room,
    });
    setPlayerList([]);
    setRoom("");
  };

  socket.on("PLAYER_CHANGE", (allPlayers: User[]) => {
    setPlayerList(allPlayers);
  });

  const submitSocketPerson = (person: string) => {
    socket.emit("SUBMIT_PERSON", {
      userName: state.user.name,
      person,
      room: state.room,
    });
  };

  const assignSocketPeople = () => {
    socket.emit("ASSIGN_PEOPLE", state.room);
  };

  return {
    joinSocketRoom,
    createSocketRoom,
    leaveSocketRoom,
    submitSocketPerson,
    assignSocketPeople,
    socket,
  };
}
