const { users, profiles, address } = require("../models");
const { cryptPassword, imageKit } = require("../utils");

module.exports = {
  register: async (req, res) => {
    const { email, password, name, gender, phone, image } = req.body;
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
              image: image,
              //   image: `/images/${req.file.filename}`,
            },
          },
        },
        include: {
          profiles: true,
        },
      });

      console.log(req.file);

      return res.status(201).json({
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
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

      console.log(req.file);

      return res.status(201).json({
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },

  upload: async (req, res) => {
    try {
      const fileToString = req.file.buffer.toString("base64");

      const uploadFile = await imageKit.upload({
        fileName: req.file.originalname,
        file: fileToString,
      });

      return res.status(200).json({
        data: {
          name: uploadFile.name,
          url: uploadFile.url,
          type: uploadFile.fileType,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },

  login: async () => {},

  getUsers: async (req, res) => {
    try {
      const user = await users.findMany({
        include: {
          profiles: true,
        },
      });

      const response = user.map((user) => ({
        id: user.id,
        email: user.email,
        password: user.password,
        profiles: {
          name: user.profiles.name,
          gender: user.profiles.gender,
          phone: user.profiles.phone,
          image: user.profiles.image,
        },
      }));

      return res.status(200).json({
        error: false,
        message: "Successfully fetched data all user",
        data: response,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  },

  updateUsers: async (req, res) => {
    const userId = parseInt(req.params.id);
    const { email, password, name, gender, phone } = req.body;

    try {
      const existingUser = await users.findUnique({
        where: { id: userId },
        include: { profiles: true },
      });

      if (!existingUser) {
        return res.status(404).json({ error: true, message: "User not found" });
      }

      const updatedProfile = {
        name: name || existingUser.profiles.name,
        gender: gender || existingUser.profiles.gender,
        phone: phone || existingUser.profiles.phone,
      };

      if (req.file) {
        updatedProfile.image = `/images/${req.file.filename}`;
      } else {
        updatedProfile.image = existingUser.profiles.image;
      }

      const updatedUser = await users.update({
        where: { id: userId },
        data: {
          email: email || existingUser.email,
          password: password
            ? await cryptPassword(password)
            : existingUser.password,
          profiles: { update: updatedProfile },
        },
        include: { profiles: true },
      });

      return res.status(200).json({
        error: false,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  },

  changePassword: async () => {},
};
