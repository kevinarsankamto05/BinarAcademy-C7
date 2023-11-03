const { users, profiles, address } = require("../models");
const { imageKit } = require("../utils/imageKit");
const { cryptPassword } = require("../utils/cryptPassword");

module.exports = {
  getProfiles: async (req, res) => {
    try {
      const user = await users.findMany({
        include: {
          profiles: true,
          address: true,
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
        address: user.address.map((address) => ({
          provinsi: address.provinsi,
          kab_kota: address.kab_kota,
          kecamatan: address.kecamatan,
          detail: address.detail,
        })),
      }));

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

  updateProfiles: async (req, res) => {
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

  updateProfilesWithImageKit: async (req, res) => {
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

      const fileToString = req.file.buffer.toString("base64");

      const uploadFile = await imageKit.upload({
        fileName: req.file.originalname,
        file: fileToString,
      });

      const updatedProfile = {
        name: name || existingUser.profiles.name,
        gender: gender || existingUser.profiles.gender,
        phone: phone || existingUser.profiles.phone,
      };

      if (req.file) {
        updatedProfile.image = uploadFile.url;
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

  deleteProfile: async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
      const existingUser = await users.findUnique({
        where: { id: userId },
        include: { profiles: true },
      });

      if (!existingUser) {
        return res.status(404).json({ error: true, message: "User not found" });
      }

      await profiles.delete({ where: { id: existingUser.profiles.id } });
      await users.delete({ where: { id: userId } });

      return res.status(200).json({
        error: false,
        message: "User and profile deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user and profile:", error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  },
};
