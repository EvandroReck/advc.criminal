const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

// Configurações
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('.'));
app.use(cookieParser());

const db = new sqlite3.Database('./siscristovao.db');

// Criar tabela de usuários
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        tipo TEXT DEFAULT 'cliente',
        cpf TEXT,
        telefone TEXT
    )`);

    // Inserir admin padrão
    db.run(`INSERT OR IGNORE INTO usuarios (email, senha, tipo, nome) VALUES ('admin@siscristovao.com', 'admin123', 'admin', 'Administrador')`);

    // Tabelas existentes (mantidas)
    db.run(`CREATE TABLE IF NOT EXISTS clientes ( ... )`); // mantenha as outras
    // ... (copie as outras criações de tabelas do original)
});

// Middleware de autenticação
function isAuthenticated(req, res, next) {
    if (req.cookies.auth) {
        return next();
    }
    res.redirect('/login.html');
}

// Rotas de Login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    db.get('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha], (err, user) => {
        if (err || !user) return res.json({ success: false, message: 'Credenciais inválidas' });
        res.cookie('auth', user.tipo, { maxAge: 3600000 });
        res.json({ success: true });
    });
});

app.post('/registrar-cliente', (req, res) => {
    const { nome, email, senha, cpf, telefone } = req.body;
    const sql = `INSERT INTO usuarios (nome, email, senha, tipo, cpf, telefone) VALUES (?, ?, ?, 'cliente', ?, ?)`;
    db.run(sql, [nome, email, senha, cpf, telefone], function(err) {
        if (err) return res.json({ success: false, message: 'Email já cadastrado ou erro' });
        // Também salva no clientes
        db.run('INSERT INTO clientes (nome, cpf, telefone) VALUES (?, ?, ?)', [nome, cpf, telefone]);
        res.json({ success: true });
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('auth');
    res.redirect('/login.html');
});

// Proteger rotas (exemplo)
app.use(['/clientes.html', '/agendamentos.html', '/servicos.html'], isAuthenticated);

// Rotas originais do server.js mantidas abaixo...
// (cole o resto do código original aqui)

app.listen(3000, () => {
    console.log('Servidor com login rodando!');
});