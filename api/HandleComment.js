import path from "path";
import fs from "fs";
// import FormData from "form-data";
// import fetch from "node-fetch";

export const CreateComment = async (data) => {
  try {
    const form = new FormData();

    // Tambahkan data ke form
    form.append("text", data.comment.text);
    form.append("task_id", data.comment.task_id);
    form.append("unique_id", data.comment.unique_id);

    if (data.media) {
      const filepath = path.join(__dirname, `../public/${data.media}`);
      form.append("file", fs.createReadStream(filepath));
    }

    const response = await fetch(
      `http://192.168.1.228:8008/api/comment-create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.access_token}`, // Jangan tambahkan `Content-Type` header di sini
        },
        body: form,
      }
    );

    const res = await response.json();
    console.log("result comment : ", res);

    return res.success ? true : false;
  } catch (error) {
    console.log("error : ", error);
    return false;
  }
};
