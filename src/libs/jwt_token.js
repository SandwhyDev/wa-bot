import { CreateFile, ReadFile } from "./HandleFile";

export const ForToken = async () => {
  try {
    console.log("halo");

    const date = Math.floor(Date.now() / 1000);
    const data = {
      name: "Bot WA",
      platform: "android",
      version: "2",
      identifier: "000001",
      fcm_token:
        "e9vqJZIrSbOviJrF0yDkLl:APA91bHCUy3Nid1VqzDkQTTlvZJ6QzrO4mn5QfHTa1K2kOJGW1ppLRbbCMLpSaoJBl4qpxSfcaexdt8PfAI0jn0Q_ZaDypXSXYcL7t3vJPd6M-dNFmZ_lQWxjp1pzRbt-B_vQmvTpBMR",
      unique_id: "1001111",
      gid: "1001111",
    };

    const response = await fetch("http://192.168.1.228:8008/api/users-create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    const result = { timestamp: date, ...res.data };

    const handleCreateFile = await CreateFile("data_bot", result);

    return result;
  } catch (error) {
    return false;
  }
};

export const CekToken = async () => {
  try {
    const cekToken = await ReadFile(); // Misalnya cekToken.timestamp adalah timestamp dalam detik
    const currentTime = Math.floor(Date.now() / 1000); // Waktu saat ini dalam detik
    const sevenDaysAgo = currentTime - 7 * 24 * 60 * 60; // Waktu 7 hari yang lalu
    var token;
    if (cekToken.timestamp < sevenDaysAgo || cekToken.success === false) {
      // Timestamp sudah lebih dari 7 hari yang lalu
      token = await ForToken();
      console.log("Token di-refresh:", token);
    } else {
      console.log("Token masih valid");

      token = cekToken;
    }

    return token;
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
