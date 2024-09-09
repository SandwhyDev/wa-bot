import fs from "fs";
import path from "path";
import generateRandomString from "./generateString";
import { CekToken } from "./jwt_token";
import md5 from "md5";
import { CreateTask } from "../../api/HandleTaskApi";
import { Server } from "socket.io";

export const HandleSocket = (server, client) => {
  // HANDLE SOCKET
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("A User Connected");

    socket.on("test", (msg) => {
      console.log(msg);
    });

    // client.on("message", async (msg) => {
    //   const CekChat = await msg.getChat();
    //   const cekContact = await msg.getContact();

    //   if (
    //     msg.isStatus ||
    //     CekChat.isGroup ||
    //     msg.title ||
    //     cekContact.number === null
    //   ) {
    //     return false;
    //   }

    //   //   cek token
    //   const token = await CekToken();

    //   var hashTask = md5(cekContact.number);
    //   const date = Math.floor(Date.now() / 1000);
    //   const HashComment = md5(`${hashTask}-${msg.body}-${date}`);

    //   // jika ada file
    //   var CekMedia;
    //   if (msg.hasMedia) {
    //     const media = await msg.downloadMedia();

    //     // Mendapatkan ekstensi file
    //     let ext = "";

    //     // Cek jenis media dan tentukan ekstensi
    //     if (media.mimetype.includes("audio")) {
    //       ext = media.mimetype.split(";")[1]?.split("=")[1] || "opus";
    //     } else if (media.mimetype.includes("application")) {
    //       ext = path.extname(media.filename).split(".")[1];
    //     } else {
    //       ext = media.mimetype.split("/")[1];
    //     }

    //     const buffer = Buffer.from(media.data, "base64");

    //     const filename = await generateRandomString();

    //     fs.writeFile(
    //       path.join(__dirname, `../../public/${filename}.${ext}`),
    //       buffer,
    //       (err) => {
    //         if (err) {
    //           console.error("Error saving the image:", err);
    //         } else {
    //           console.log("Image saved successfully!");
    //         }
    //       }
    //     );

    //     CekMedia = `${filename}.${ext}`;
    //   }

    //   var user;

    //   if (cekContact.name) {
    //     user = cekContact.name;
    //   } else if (cekContact.pushname) {
    //     user = cekContact.pushname;
    //   } else if (cekContact.shortName) {
    //     user = cekContact.shortName;
    //   } else {
    //     user = "Unknown User";
    //   }

    //   const data = {
    //     id: msg.id.id,
    //     from: cekContact.number,
    //     name: cekContact.name,
    //     media: CekMedia ? CekMedia : null,
    //     access_token: token.access_token,
    //     task: {
    //       unique_id: hashTask,
    //       title: `INQUIRY | ${cekContact.number}`,
    //       description: `phone: ${cekContact.number}\nname: ${user}`,
    //       group_id: "10101010",
    //       parent_id: "abc",
    //     },
    //     comment: {
    //       unique_id: HashComment,
    //       task_id: hashTask,
    //       text: msg.body,
    //     },
    //   };

    //   //   if (CekMedia) {
    //   //     data.comment = {
    //   //       file: CekMedia,
    //   //     };
    //   //   }

    //   socket.emit("new_message", data);

    //   const createTask = await CreateTask(data);
    // });

    socket.on("disconnect", () => {
      console.log("A User Disconnected");
    });
  });
};
