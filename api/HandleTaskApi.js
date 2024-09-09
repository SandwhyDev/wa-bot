import { CreateComment } from "./HandleComment";

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
      const formData = new FormData();
      // Tambahkan data ke formData
      formData.append("unique_id", data.task.unique_id);
      formData.append("title", data.task.title);
      formData.append("description", data.task.description);
      formData.append("group_id", data.task.group_id);
      if (data.media) {
        const filepath = path.join(__dirname, `../../public/${data.media}`);
        formData.append("file", fs.createReadStream(filepath));
      }

      const response = await fetch(
        `http://192.168.1.228:8008/api/tasks-create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
          body: formData,
        }
      );

      const res = await response.json();

      console.log("result task : ", res);

      if (res.success) {
        const BuatComment = await CreateComment(data);

        return true;
      } else {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.log("error : ", error);

    return false;
  }
};
