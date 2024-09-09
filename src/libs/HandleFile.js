import fs from "fs";
import path from "path";

export const CreateFile = async (filename, data) => {
  try {
    const create = await fs.writeFileSync(
      path.join(__dirname, "../../data.txt"),
      JSON.stringify(data, null, 2)
    );

    return true;
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: error.message,
    };
  }
};

export const ReadFile = () => {
  try {
    const data = fs.readFileSync(
      path.join(__dirname, "../../data.txt"),
      "utf8"
    );
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
