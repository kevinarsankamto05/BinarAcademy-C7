const { address, users } = require("../models");

module.exports = {
  createAddress: async (req, res) => {
    let { provinsi, kab_kota, kecamatan, detail, id_users } = req.body;
    id_users = parseInt(id_users);

    try {
      const response = await address.create({
        data: {
          provinsi: provinsi,
          kab_kota: kab_kota,
          kecamatan: kecamatan,
          detail: detail,
          users: {
            connect: { id: id_users },
          },
        },
      });
      return res.status(201).json({
        data: response,
      });
    } catch (error) {
      return res.status(500).json({
        error,
      });
    }
  },

  getAddress: async (req, res) => {
    try {
      const addres = await address.findMany({
        include: {
          users: true,
        },
      });

      if (!addres || addres.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "No Address found" });
      }

      const response = addres.map((addres) => {
        return {
          id: addres.id,
          provinsi: addres.provinsi,
          kab_kota: addres.kab_kota,
          kecamatan: addres.kecamatan,
          detail: addres.detail,
          id_users: addres.users.id,
        };
      });

      return res.status(200).json({
        error: false,
        message: "Fetched all bank accounts successfully",
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  },

  updateAddress: async (req, res) => {
    const { id } = req.params;
    const { provinsi, kab_kota, kecamatan, detail } = req.body;

    try {
      const existingAddress = await address.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!existingAddress) {
        return res
          .status(404)
          .json({ error: true, message: "Address not found" });
      }

      const updatedAddress = await address.update({
        where: {
          id: parseInt(id),
        },
        data: {
          provinsi: provinsi || existingAddress.provinsi,
          kab_kota: kab_kota || existingAddress.kab_kota,
          kecamatan: kecamatan || existingAddress.kecamatan,
          detail: detail || existingAddress.detail,
        },
      });

      return res.status(200).json({
        error: false,
        message: "Address updated successfully",
        data: updatedAddress,
      });
    } catch (error) {
      console.error("Error updating address:", error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  },

  deleteAddress: async (req, res) => {
    const { id } = req.params;

    try {
      const existingAddress = await address.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!existingAddress) {
        return res
          .status(404)
          .json({ error: true, message: "Address not found" });
      }

      await address.delete({
        where: {
          id: parseInt(id),
        },
      });

      return res.status(200).json({
        error: false,
        message: "Address deleted successfully",
        data: existingAddress,
      });
    } catch (error) {
      console.error("Error deleting address:", error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  },
};
