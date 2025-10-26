const Competence = require("../models/Competence");

exports.getAllCompetences = async (req, res) => {
  try {
    const competences = await Competence.find();
    res.status(200).json(competences);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las competencias", error });
  }
};

exports.getCompetenceById = async (req, res) => {
  try {
    const competence = await Competence.findById(req.params.id);
    if (!competence) return res.status(404).json({ message: "Competencia no encontrada" });
    res.status(200).json(competence);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la competencia", error });
  }
};

exports.createCompetence = async (req, res) => {
  try {
    const newCompetence = new Competence(req.body);
    await newCompetence.save();
    res.status(201).json(newCompetence);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la competencia", error });
  }
};

exports.updateCompetence = async (req, res) => {
  try {
    const updatedCompetence = await Competence.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedCompetence) return res.status(404).json({ message: "Competencia no encontrada" });
    res.status(200).json(updatedCompetence);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la competencia", error });
  }
};

exports.deleteCompetence = async (req, res) => {
  try {
    const deletedCompetence = await Competence.findByIdAndDelete(req.params.id);
    if (!deletedCompetence) return res.status(404).json({ message: "Competencia no encontrada" });
    res.status(200).json({ message: "Competencia eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la competencia", error });
  }
};
