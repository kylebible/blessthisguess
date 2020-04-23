import { useStore } from "@/features/store";
import User from "@/models/user";
import io from "socket.io-client";

export function useSockets() {
  const { state, setRoom, setUserName, setPlayerList } = useStore();
  const HOST = location.origin.replace(/^http/, "ws");
  const socket = io(HOST);

  const joinSocketRoom = (
    roomName: string,
    userName: string,
    isNew: boolean
  ): Promise<{ room: string; allPlayers: User[] }> => {
    return new Promise((resolve, reject) => {
      socket.emit(
        "JOIN_ROOM",
        { roomName: roomName.toUpperCase(), userName, isNew },
        (room: string, allPlayers: User[], error: string) => {
          if (error) {
            reject(error);
          } else {
            resolve({ room, allPlayers });
          }
        }
      );
    });
  };

  const refreshConnection = (): Promise<User[]> => {
    return new Promise((resolve, reject) => {
      socket.emit(
        "REFRESH_CONNECTION",
        state.room,
        (allPlayers: User[], error: string) => {
          if (error) {
            reject(error);
          }
          resolve(allPlayers);
        }
      );
    });
  };

  const leaveSocketRoom = () => {
    socket.emit("LEAVE_ROOM", {
      userName: state.user.name,
      roomName: state.room,
    });
    setPlayerList([]);
    setRoom("");
  };

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

  socket.on("PLAYER_CHANGE", (allPlayers: User[]) => {
    setPlayerList(allPlayers);
  });

  return {
    joinSocketRoom,
    leaveSocketRoom,
    submitSocketPerson,
    assignSocketPeople,
    refreshConnection,
    socket,
  };
}
