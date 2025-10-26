const Unfeat = require("../models/Unfeat");

exports.getAllUnfeats = async (req, res) => {
  try {
    const unfeats = await Unfeat.find();
    res.status(200).json(unfeats);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los unfeats", error });
  }
};

exports.getUnfeatById = async (req, res) => {
  try {
    const unfeat = await Unfeat.findById(req.params.id);
    if (!unfeat) return res.status(404).json({ message: "Unfeat no encontrado" });
    res.status(200).json(unfeat);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el unfeat", error });
  }
};

exports.createUnfeat = async (req, res) => {
  try {
    const newUnfeat = new Unfeat(req.body);
    await newUnfeat.save();
    res.status(201).json(newUnfeat);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el unfeat", error });
  }
};

exports.updateUnfeat = async (req, res) => {
  try {
    const updatedUnfeat = await Unfeat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUnfeat) return res.status(404).json({ message: "Unfeat no encontrado" });
    res.status(200).json(updatedUnfeat);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el unfeat", error });
  }
};

exports.deleteUnfeat = async (req, res) => {
  try {
    const deletedUnfeat = await Unfeat.findByIdAndDelete(req.params.id);
    if (!deletedUnfeat) return res.status(404).json({ message: "Unfeat no encontrado" });
    res.status(200).json({ message: "Unfeat eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el unfeat", error });
  }
};
