import express from "express";
import ForToken, { CekToken } from "../libs/jwt_token";
import { ReadFile } from "../libs/HandleFile";
import fs from "fs";
import path from "path";
import { SendOtp } from "../libs/wa_web";

const send_message_controllers = express.Router();

const model = "models_prisma";

// create
send_message_controllers.post(`/send-message`, async (req, res) => {
  try {
    const token = await CekToken();

    res.status(201).json({
      success: true,
      message: "berhasil",
      // data: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// send otp
send_message_controllers.post(`/send-otp`, async (req, res) => {
  try {
    const data = await req.body;
    console.log(data);

    const otp = await SendOtp(data.phone_number, data.otp);

    res.status(201).json({
      success: true,
      message: "berhasil",
      // data: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// read
send_message_controllers.get(`/bot-wa-read`, async (req, res) => {
  try {
    const find = await model.findMany();

    res.status(200).json({
      success: true,
      message: "berhasil",
      data: find,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// update
send_message_controllers.post(`/bot-wa-update`, async (req, res) => {
  try {
    const data = await req.body;

    const update = await model.update({
      where: {
        id: +data.id,
      },
      data: data,
    });

    res.status(200).json({
      success: true,
      message: "berhasil update",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// delete
send_message_controllers.post(`/bot-wa-create/:id`, async (req, res) => {
  try {
    const { id } = await req.params;

    const hapus = await model.delete({
      where: {
        id: +id,
      },
    });

    res.status(200).json({
      success: true,
      message: "berhasil update",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default send_message_controllers;
