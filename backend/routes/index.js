require("dotenv").config();
var express = require("express");
var router = express.Router();
var mysql = require("mysql2");
var moment = require("moment");
const auth = require("../middleware/auth");
const cors = require("cors");

router.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

//test

const db = mysql.createPool({
  host: "localhost", // Adresse du serveur MySQL
  user: "root", // Nom d'utilisateur MySQL
  password: "", // Mot de passe MySQL
  database: "ticketing", // Nom de la base de données
  port: 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Vérification de la connexion
db.getConnection((err, connection) => {
  if (err) {
    console.error("Erreur de connexion à MySQL :", err.message);
  } else {
    console.log("✅ Connecté à MySQL");
    connection.release();
  }
});

// /* POST Request page. */
router.post("/invite/request", (req, res) => {
  const sql =
    `
        INSERT INTO demande (
            id_demande,
            Description,
            Date_creation,
            Num_AFPA_invite,
            Nom_AFPA_invite,
            Prenom_AFPA_invite,
            realise,
            id_status,
            id_demandeur,
            id_technicien,
            id_validateur
            Date_realise
        )
        VALUES (NULL, '` +
    req.body.Description +
    `', '` +
    moment().format("YYYY-MM-DD") +
    `', '` +
    req.body.Num_AFPA_invite +
    `', '` +
    req.body.Nom_AFPA_invite +
    `', '` +
    req.body.Prenom_AFPA_invite +
    `', '0', NULL, NULL, NULL, NULL,NULL)
    `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur SQL :", err);

      return res.status(500).json({
        message: err.message,
        code: err.code,
        sqlMessage: err.sqlMessage,
      });
    } else {
      return res.status(200).json({
        message: "Demande ajoutée",
        code: "OK",
      });
    }
  });
});

// /* GET NbRequest page. */
router.get("/invite/request/:NbRequest", (req, res) => {
  const NbRequest = req.params.NbRequest;
  const sql = "SELECT * FROM demande WHERE id_demande = ?";
  db.query(sql, [NbRequest], (err, results) => {
    if (err) {
      console.error("Erreur lors de la requête :", err.message);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    res.json(results);
  });
});

// /* GET Menu page. */

router.get("/dashboard", (req, res) => {
  const sql = "SELECT *  FROM `demande` ";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la requête :", err.message);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    res.json(results);
  });
});
// /* GET priority page. */
// router.update('/dashboard/priority/:id_demande', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
// /* GET réalisé page. */
// router.update('/dashboard/realise/:id_demande', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// /* GET prise en charge page. */
// router.update('/dashboard/requesttaken/:id_demande', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.put("/dashboard/update/:id_demande", function (req, res, next) {
  const id = req.params.id_demande;
  const sql =
    " UPDATE demande SET id_status = " +
    req.body.id_status +
    " WHERE id_demande=? ";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erreur SQL :", err);

      return res.status(500).json({
        message: err.message,
        code: err.code,
        sqlMessage: err.sqlMessage,
      });
    } else {
      return res.status(200).json({
        message: "status modifié",
        code: "OK",
      });
    }
  });
});

// changement de réaliser
router.put("/dashboard/update/realise/:id_demande", function (req, res, next) {
  const id = req.params.id_demande;
  const sql =
    ` UPDATE demande SET realise = 1, Date_realise = '` +
    moment().format("YYYY-MM-DD") +
    `' WHERE id_demande=? `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erreur SQL :", err);

      return res.status(500).json({
        message: err.message,
        code: err.code,
        sqlMessage: err.sqlMessage,
      });
    } else {
      return res.status(200).json({
        message: "realise modifié , date realise ajouter",
        code: "OK",
      });
    }
  });
});

// /* POST Inscription page. */

const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  const { id_user, Nom, Prenom, Num_AFPA, Password, id_role } = req.body;

  // try {
  const hash = await bcrypt.hash(Password, 10);

  const sql =
    `
            INSERT INTO user_(
            id_user,
            Nom,
            Prenom, 
            Num_AFPA,
            Password,
            id_role)
            VALUES (NULL, '` +
    req.body.Nom +
    `','` +
    req.body.Prenom +
    `','` +
    req.body.Num_AFPA +
    `','` +
    hash +
    `','4')
        `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur SQL :", err);

      return res.status(500).json({
        message: err.message,
        code: err.code,
        sqlMessage: err.sqlMessage,
      });
    } else {
      return res.status(200).json({
        message: "compte ajoutée",
        code: "OK",
      });
    }
  });
});

// /* POST login page. */

const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const { Num_AFPA, Password } = req.body;

  const sql = `
        SELECT *
        FROM user_
        WHERE Num_AFPA = ?
    `;

  db.query(sql, [Num_AFPA], async (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(401).json({
        message: "Utilisateur introuvable",
      });
    }

    const user = result[0];

    const isValid = await bcrypt.compare(Password, user.Password);

    if (!isValid) {
      return res.status(401).json({
        message: "Mot de passe incorrect",
      });
    }

    const token = jwt.sign(
      {
        id: user.id_user,
        Num_AFPA: user.Num_AFPA,
        id_role: user.id_role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    return res.status(200).json({
      message: "connexion réussi",
      code: "OK",
    });
  });
});

// app.get('/profil', auth, (req, res) => {

//     res.json({
//         message: 'Accès autorisé',
//         user: req.user
//     });

// });

module.exports = router;
