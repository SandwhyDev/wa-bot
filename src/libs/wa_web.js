const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcodeTerminal = require("qrcode-terminal");
const qrcode = require("qrcode");
import fs from "fs";
import path from "path";
import generateRandomString from "./generateString";
import { CekToken } from "./jwt_token";
import md5 from "md5";
import { CreateTask } from "../../api/HandleTaskApi";
import { processMedia } from "./ProsesMedia";

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "wa-login",
  }),
  puppeteer: {
    // headless: false  ,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

export const initializeSocket = (server) => {
  // try {
  client.on("qr", (qr) => {
    qrcodeTerminal.generate(qr, { small: true });
    qrcode.toFile(
      path.join(__dirname, "../../public/qr-code.png"),
      qr,
      { type: "png", width: 300, errorCorrectionLevel: "H" },
      (err) => {
        if (err) {
          console.error("Failed to save QR code image:", err);
        } else {
          console.log("QR code image saved successfully.");
        }
      }
    );
  });

  client.on("authenticated", () => {
    console.log("Authenticated successfully");
  });

  client.on("auth_failure", (msg) => {
    console.error("AUTHENTICATION FAILURE", msg);
  });

  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.on("message", async (msg) => {
    const CekChat = await msg.getChat();
    const cekContact = await msg.getContact();

    if (
      msg.isStatus ||
      CekChat.isGroup ||
      msg.title ||
      cekContact.number === null
    ) {
      return false;
    }

    //   cek token
    const token = await CekToken();

    var hashTask = md5(cekContact.number);
    const date = Math.floor(Date.now() / 1000);
    const HashComment = md5(`${hashTask}-${msg.body}-${date}`);

    // jika ada file
    var CekMedia;
    if (msg.hasMedia) {
      const handleMedia = await processMedia(msg);
      CekMedia = handleMedia;
    }

    var user;

    if (cekContact.name) {
      user = cekContact.name;
    } else if (cekContact.pushname) {
      user = cekContact.pushname;
    } else if (cekContact.shortName) {
      user = cekContact.shortName;
    } else {
      user = "Unknown User";
    }

    const data = {
      id: msg.id.id,
      from: cekContact.number,
      name: cekContact.name,
      media: CekMedia ? CekMedia : null,
      access_token: token.access_token,
      task: {
        unique_id: hashTask,
        title: `INQUIRY | ${cekContact.number}`,
        description: `phone: ${cekContact.number}\nname: ${user}`,
        group_id: "10101010",
        parent_id: "abc",
      },
      comment: {
        unique_id: HashComment,
        task_id: hashTask,
        text: msg.body,
      },
    };

    //   if (CekMedia) {
    //     data.comment = {
    //       file: CekMedia,
    //     };
    //   }

    // socket.emit("new_message", data);

    const createTask = await CreateTask(data);
  });

  client.on("message_create", async (msg) => {
    let group_id = msg.to.replace("@g.us", "");

    if (msg.isStatus || msg.title || group_id !== "120363318345844862") {
      return false;
    }

    console.log(msg);

    //   cek token
    const token = await CekToken();
    var CekMedia;
    if (msg.hasMedia) {
      const handleMedia = await processMedia(msg);
      CekMedia = handleMedia;
    }

    const date = Math.floor(Date.now() / 1000);
    var HashId = md5(`${group_id}-${msg.body}-${date}`);

    const HashComment = md5(`${group_id}-${msg.body}-${date}`);

    const data = {
      id: msg.id.id,
      group_id: group_id,
      media: CekMedia ? CekMedia : null,
      access_token: token.access_token,
      task: {
        unique_id: HashId,
        title: `INQUIRY | `,
        description: msg.body,
        group_id: "10101010",
      },
    };

    // console.log(data);

    const createTask = await CreateTask(data);
  });

  // client.on("disconnected", (reason) => {
  //   console.log("whatsapp keluar karena : ", reason);

  //   // Restart client untuk menghasilkan QR code baru
  //   client.destroy().then(() => {
  //     client.initialize();
  //   });
  // });

  client.on("disconnected", (reason) => {
    console.log("Client was logged out due to", reason);

    // Tangkap error yang terjadi saat logout
    try {
      client
        .destroy()
        .then(() => {
          console.log("Client destroyed, reinitializing...");
          client.initialize();
        })
        .catch((err) => {
          console.error("Error during client destruction:", err.message);

          // Hapus file secara manual jika error disebabkan oleh file terkunci
          if (err.code === "EBUSY" && err.path) {
            const filePath = err.path;
            console.log(
              `Attempting to manually delete locked file: ${filePath}`
            );

            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Manual file deletion failed:", err.message);
              } else {
                console.log(
                  "Locked file deleted successfully, reinitializing client..."
                );
                client.initialize();
              }
            });
          }
        });
    } catch (e) {
      console.error("Caught exception:", e.message);
    }
  });

  // Listener untuk menangani uncaught exceptions dan mencegah server crash
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err.message);
  });

  client.initialize();
  // } catch (error) {
  //   console.log("error : ", error);
  // }
};

export const SendOtp = async (number, otp) => {
  try {
    // Pastikan client sudah siap sebelum mengirim OTP
    if (client.info?.wid) {
      if (!number) {
        return {
          status: false,
          message: "number not found",
        };
      }

      var phone_number = number.replace("+", "");

      const pesan = [
        {
          message: "Hundredapps\nJangan berikan kode ini kepada siapa pun.",
        },
        {
          message: `*${otp}*`,
        },
      ];

      const chatId = `${phone_number}@c.us`;

      for (const e of pesan) {
        client
          .sendMessage(chatId, e.message)
          .then((response) => {
            console.log("Pesan berhasil dikirim!");
          })
          .catch((err) => {
            console.error("Gagal mengirim pesan:", err);
          });
      }
    } else {
      console.log("Client is not ready yet");
    }
  } catch (error) {
    return error;
  }
};
