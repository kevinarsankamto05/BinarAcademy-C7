const { users, profiles, address } = require("../models"),
  { cryptPassword } = require("../utils/cryptPassword"),
  { imageKit } = require("../utils/imageKit"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt");
require("dotenv").config();
const secret_key = process.env.JWT_KEY || "no_secret";

module.exports = {
  register: async (req, res) => {
    const { email, password, name, gender, phone } = req.body;
    try {
      const data = await users.create({
        data: {
          email: email,
          password: await cryptPassword(password),
          profiles: {
            create: {
              name: name,
              gender: gender,
              phone: phone,
              image: `/images/profiles${req.file.filename}`,
            },
          },
        },
        include: {
          profiles: true,
        },
      });
      return res.status(201).json({
        data,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  },

  registerWithImageKit: async (req, res) => {
    const { email, password, name, gender, phone } = req.body;
    try {
      const fileToString = req.file.buffer.toString("base64");

      const uploadFile = await imageKit.upload({
        fileName: req.file.originalname,
        file: fileToString,
      });
      const data = await users.create({
        data: {
          email: email,
          password: await cryptPassword(password),
          profiles: {
            create: {
              name: name,
              gender: gender,
              phone: phone,
              image: uploadFile.url,
            },
          },
        },
        include: {
          profiles: true,
        },
      });
      return res.status(201).json({
        data,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  },

  login: async (req, res) => {
    try {
      const findUser = await users.findFirst({
        where: {
          email: req.body.email,
        },
      });

      if (!findUser) {
        return res.status(404).json({
          error: true,
          message: "Your email is not registred in our system",
        });
      }

      if (bcrypt.compareSync(req.body.password, findUser.password)) {
        const token = jwt.sign({ id: findUser.id }, secret_key, {
          expiresIn: "6h",
        });
        return res.status(200).json({
          error: false,
          message: "Successfully login",
          data: {
            token,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  },

  getUsers: async (req, res) => {
    try {
      const user = await users.findUnique({
        where: {
          id: res.user.id,
        },
        include: {
          profiles: true,
          address: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: true, message: "User not found" });
      }

      const response = {
        id: user.id,
        email: user.email,
        password: user.password,
        profiles: {
          name: user.profiles.name,
          gender: user.profiles.gender,
          phone: user.profiles.phone,
          image: user.profiles.image,
        },
        address: user.address.map((address) => ({
          provinsi: address.provinsi,
          kab_kota: address.kab_kota,
          kecamatan: address.kecamatan,
          detail: address.detail,
        })),
      };

      return res.status(200).json({
        error: false,
        message: "Successfully fetched data all user",
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  },

  changePassword: async (req, res) => {
    const user = await users.findUnique({
      where: {
        id: res.user.id,
      },
    });

    if (bcrypt.compareSync(req.body.old_password, user.password)) {
      const data = await users.update({
        where: {
          id: res.user.id,
        },
        data: {
          password: await cryptPassword(req.body.password),
        },
      });
      return res.status(200).json({
        error: false,
        message: "Your password has been successfully updated",
        data: user,
      });
    }
    return res.status(403).json({
      error: true,
      message: "Your old password is not valid",
    });
  },
};
