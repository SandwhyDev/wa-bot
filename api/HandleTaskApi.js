import { CreateComment } from "./HandleComment";
import path from "path";
import fs from "fs";

export const ReadTask = async (unique_id) => {
  try {
    const response = await fetch(
      `http://192.168.1.228:8008/api/tasks-read?unique_id=${unique_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const res = await response.json();

    if (res.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);

    return false;
  }
};

export const CreateTask = async (data) => {
  try {
    const cekTask = await ReadTask(data.task.unique_id);

    if (cekTask) {
      console.log("harusnya muncul");

      const BuatComment = await CreateComment(data);
    } else {
      const form = new FormData();

      // Tambahkan data ke form
      form.append("unique_id", data.task.unique_id);
      form.append("title", data.task.title);
      form.append("description", data.task.description);
      form.append("group_id", data.task.group_id);

      if (data.media) {
        const filepath = path.join(__dirname, `../public/${data.media}`);
        const stats = fs.statSync(filepath);
        const fileSizeInBytes = stats.size;
        const fileStream = fs.createReadStream(filepath);
        form.append("file", fileStream);
      }

      try {
        const response = await fetch(
          `http://192.168.1.228:8008/api/tasks-create`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${data.access_token}`,
            },
            body: form,
          }
        );

        const res = await response.json();
        console.log("result task: ", res);

        if (res.success) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error("Error sending data to server: ", error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.log("error : ", error);

    return false;
  }
};
