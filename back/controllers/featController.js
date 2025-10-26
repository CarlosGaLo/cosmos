const Feat = require("../models/Feat");

exports.getAllFeats = async (req, res) => {
  try {
    const feats = await Feat.find();
    res.status(200).json(feats);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los feats", error });
  }
};

exports.getFeatById = async (req, res) => {
  try {
    const feat = await Feat.findById(req.params.id);
    if (!feat) return res.status(404).json({ message: "Feat no encontrado" });
    res.status(200).json(feat);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el feat", error });
  }
};

exports.createFeat = async (req, res) => {
  try {
    const newFeat = new Feat(req.body);
    await newFeat.save();
    res.status(201).json(newFeat);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el feat", error });
  }
};

exports.updateFeat = async (req, res) => {
  try {
    const updatedFeat = await Feat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedFeat) return res.status(404).json({ message: "Feat no encontrado" });
    res.status(200).json(updatedFeat);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el feat", error });
  }
};

exports.deleteFeat = async (req, res) => {
  try {
    const deletedFeat = await Feat.findByIdAndDelete(req.params.id);
    if (!deletedFeat) return res.status(404).json({ message: "Feat no encontrado" });
    res.status(200).json({ message: "Feat eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el feat", error });
  }
};
