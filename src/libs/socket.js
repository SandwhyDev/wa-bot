// import { Server } from "socket.io";

// export const initializeSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "*",
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("A User Connected");
//     socket.emit("halo", "halo client");

//     socket.on("test", (msg) => {
//       console.log(msg);
//     });

//     socket.on("disconnect", () => {
//       console.log("A User Disconnected");
//     });
//   });

//   client.on("qr", (qr) => {
//     // Generate and scan this code with your phone
//     qrcode.generate(qr, { small: true });
//   });

//   client.on("ready", () => {
//     console.log("Client is ready!");
//   });

//   client.on("message", async (msg) => {
//     const CekChat = await msg.getChat();
//     const cekContact = await msg.getContact();

//     if (
//       msg.isStatus ||
//       CekChat.isGroup ||
//       msg.title ||
//       cekContact.number === null
//     ) {
//       return false;
//     }

//     console.log("number ", cekContact);

//     const token = await CekToken();

//     var hashTask = md5(cekContact.number);
//     const date = Math.floor(Date.now() / 1000);
//     const HashComment = md5(`${hashTask}-${msg.body}-${date}`);

//     // jika ada file
//     var CekMedia;
//     if (msg.hasMedia) {
//       const media = await msg.downloadMedia();

//       // Mendapatkan ekstensi file
//       let ext = "";

//       // Cek jenis media dan tentukan ekstensi
//       if (media.mimetype.includes("audio")) {
//         ext = media.mimetype.split(";")[1]?.split("=")[1] || "opus";
//       } else if (media.mimetype.includes("application")) {
//         ext = path.extname(media.filename).split(".")[1];
//       } else {
//         ext = media.mimetype.split("/")[1];
//       }

//       const buffer = Buffer.from(media.data, "base64");

//       const filename = await generateRandomString();

//       fs.writeFile(
//         path.join(__dirname, `../../public/${filename}.${ext}`),
//         buffer,
//         (err) => {
//           if (err) {
//             console.error("Error saving the image:", err);
//           } else {
//             console.log("Image saved successfully!");
//           }
//         }
//       );

//       CekMedia = `${filename}.${ext}`;
//     }

//     var user;

//     if (cekContact.name) {
//       user = cekContact.name;
//     } else if (cekContact.pushname) {
//       user = cekContact.pushname;
//     } else if (cekContact.shortName) {
//       user = cekContact.shortName;
//     } else {
//       user = "Unknown User";
//     }

//     const data = {
//       id: msg.id.id,
//       from: cekContact.number,
//       name: cekContact.name,
//       media: CekMedia ? CekMedia : null,
//       access_token: token.access_token,
//       task: {
//         unique_id: hashTask,
//         title: `INQUIRY | ${cekContact.number}`,
//         description: `phone: ${cekContact.number}\nname: ${user}`,
//         // description: `test`,
//         group_id: "10101010",
//         parent_id: "abc",
//       },
//       comment: {
//         unique_id: HashComment,
//         task_id: hashTask,
//         text: msg.body,
//       },
//     };

//     const createTask = await CreateTask(data);

//     if (msg.body == "!ping") {
//       msg.reply("pong");
//     }
//   });

//   client.on("authenticated", () => {
//     console.log("Authenticated successfully");
//   });

//   // Event ketika sesi gagal di-load
//   client.on("auth_failure", (msg) => {
//     console.error("AUTHENTICATION FAILURE", msg);
//   });

//   client.initialize();
// };
