const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const USERS_FILE = path.join(__dirname, 'approved-users.json');

app.use(cors());
app.use(express.json());

// Leer usuarios desde el archivo
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]', 'utf8');
  }
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data);
}

// Guardar usuarios en el archivo
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Endpoint para obtener todos los usuarios
app.get('/api/users', (req, res) => {
  const users = readUsers();
  res.json(users);
});

// Endpoint para registrar un usuario
app.post('/api/register', (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  let users = readUsers();
  // Verificar si el email ya existe
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ error: 'El usuario ya está registrado' });
  }
  const newUser = { nombre, email, password, fecha: new Date().toISOString() };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json({ message: 'Usuario registrado correctamente', user: newUser });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
