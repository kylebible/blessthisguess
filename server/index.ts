import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import io from "socket.io";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.json());

const publicPath = __dirname + "/";
const staticConf = { maxAge: "1y", etag: false };
app.use(express.static(publicPath, staticConf));

const port = 8080;

interface Room {
  name: string;
  playerList: User[];
}

interface User {
  name: string;
  assignedName?: string;
  submittedName?: string;
  isCreator: boolean;
}

interface Question {
  question: string;
  answers: boolean[];
}

const rooms: { [key: string]: Room } = {};

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const server = app.listen(process.env.PORT || port, () => {
  const runningPort = server.address();
  // tslint:disable-next-line:no-console
  console.log(`server started at ${process.env.PORT}`);
});

const mio = io(server);

mio.on("connection", (socket: io.Socket) => {
  socket.on(
    "JOIN_ROOM",
    (
      data: { roomName: string; userName: string; isNew: true },
      resolve: (roomName: string, allPlayers: User[], error: string) => void
    ) => {
      const room = rooms[data.roomName];
      // tslint:disable-next-line:no-console
      if (room) {
        if (data.isNew) {
          resolve("", [], "Duplicate Room Name");
        } else if (
          room.playerList.findIndex((p) => p.name === data.userName) < 0
        ) {
          socket.join(room.name);
          room.playerList.push({ name: data.userName, isCreator: false });
          socket.to(room.name).emit("PLAYER_CHANGE", room.playerList);
          resolve(room.name, room.playerList, "");
        } else {
          resolve("", [], "Duplicate Player Name");
        }
      } else {
        if (!data.isNew) {
          resolve("", [], "Room Does Not Exist");
        } else {
          let roomName = data.roomName;
          if (roomName === "") {
            roomName = makeRoom(4);
            // regenerates room name if already exists
            while (rooms[roomName]) {
              roomName = makeRoom(4);
            }
          }
          socket.join(roomName);
          const newRoom = {
            name: roomName,
            playerList: [{ name: data.userName, isCreator: true }],
          };
          rooms[roomName] = newRoom;
          resolve(newRoom.name, newRoom.playerList, "");
        }
      }
    }
  );

  socket.on("LEAVE_ROOM", (data: { userName: string; roomName: string }) => {
    if (rooms[data.roomName]) {
      const room = rooms[data.roomName];
      room.playerList = room.playerList.filter((p) => p.name !== data.userName);
      socket.to(data.roomName).emit("PLAYER_CHANGE", room.playerList);
      socket.leave(data.roomName);
    }
  });

  socket.on(
    "SUBMIT_PERSON",
    (data: { userName: string; person: string; room: string }) => {
      const room = rooms[data.room];
      const player = room.playerList.find((p) => p.name === data.userName);
      if (player) {
        player.submittedName = data.person;
        mio.in(room.name).emit("PLAYER_CHANGE", room.playerList);
      }
    }
  );

  socket.on("ASSIGN_PEOPLE", (roomName: string) => {
    const room = rooms[roomName];
    if (room) {
      shuffle(room.playerList);
      assignPeople(room.playerList);
      mio.in(room.name).emit("PLAYER_CHANGE", room.playerList);
    }
  });
});

function makeRoom(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function assignPeople(players: User[]): void {
  const copy = shuffle(players);
  for (let i = players.length - 1; i >= 0; i--) {
    // tslint:disable-next-line:no-console
    console.log(copy);
    for (let j = copy.length - 1; j >= 0; j--) {
      if (copy[j].submittedName !== players[i].submittedName) {
        players[i].assignedName = copy[j].submittedName;
        // tslint:disable-next-line:no-console
        console.log(players[i]);
        copy.splice(j, 1);
        break;
      }
    }
  }
}

function shuffle(players: User[]) {
  const copy = players.slice(0);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
