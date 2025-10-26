const User = require("../models/users/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Secret para JWT — puedes moverlo a .env
const JWT_SECRET = process.env.JWT_SECRET || "supersecreto123";
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true para 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.registerUser = async (req, res) => {
  try {
    const { name, correoElectronico, password } = req.body;

    // Validación básica
    if (!name || !correoElectronico || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    // Comprobar si el usuario ya existe
    const userExist = await User.findOne({ correoElectronico });
    if (userExist) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const newUser = new User({
      name,
      correoElectronico,
      password: hashedPassword,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { correoElectronico, password } = req.body;

    // Validación
    if (!correoElectronico || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const user = await User.findOne({ correoElectronico });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    // Generar JWT
    const token = jwt.sign({ id: user._id, rol: user.rol }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        name: user.name,
        correoElectronico: user.correoElectronico,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.recoverPassword = async (req, res) => {
  const { name, correoElectronico } = req.body;
  if (!name || !correoElectronico) {
    return res
      .status(400)
      .json({ message: "Nombre y correo electrónico son obligatorios" });
  }

  try {
    // 1. Buscar usuario
    const user = await User.findOne({ name, correoElectronico });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado con esos datos" });
    }

    // 2. Generar contraseña de 6 dígitos
    const newPassword = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Hashear y actualizar
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // 4. Devolver la contraseña en texto
    return res.status(200).json({
      message: "Contraseña restablecida correctamente",
      newPassword,
    });
  } catch (error) {
    console.error("recoverPassword:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
