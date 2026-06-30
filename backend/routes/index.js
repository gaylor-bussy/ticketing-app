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

// ##############################################################################################################
// #                                         Demande invité page                                                #
// ##############################################################################################################

router.post("/invite/request", (req, res) => {
  if (
    !req.body.Description ||
    !req.body.Num_AFPA_invite ||
    !req.body.Nom_AFPA_invite ||
    !req.body.Prenom_AFPA_invite ||
    !req.body.id_status
  ) {
    return res.status(404).json({
      message: "Saisie incorrect.",
    });
  }

  if (!/^\d+$/.test(req.body.Num_AFPA_invite)) {
    return res.status(400).json({
      message: " Doit contenir uniquement des chiffres.",
    });
  }


  const sql = `
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
      id_positionneur,
      Date_realise
    )
    VALUES (
      NULL,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      NULL,
      ?,
      NULL,
      NULL
    )
  `;

  const values = [
    req.body.Description,
    moment().format("YYYY-MM-DD HH:mm:ss"),
    req.body.Num_AFPA_invite,
    req.body.Nom_AFPA_invite,
    req.body.Prenom_AFPA_invite,
    0,
    req.body.id_status,
    8,
  ];
  console.log(values);
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erreur SQL :", err);

      return res.status(500).json({
        message: err.message,
        code: err.code,
        sqlMessage: err.sqlMessage,
      });
    }

    return res.status(200).json({
      results: result.insertId,
    });
  });
});
// ##############################################################################################################
// #                                         requete invité                                                     #
// ##############################################################################################################

router.get("/invite/request/:NbRequest", (req, res) => {
  const NbRequest = req.params.NbRequest;
  const sql = "SELECT * FROM demande WHERE id_demande = ?";
  db.query(sql, [NbRequest], (err, results) => {
    if (results.length === 0) {
      return res.status(409).json({
        message: "Cette demande n'existe pas.",
      });

    }
    if (err) {
      console.error("Erreur lors de la requête :", err.message);
      return res.status(500).json({ message: "Erreur serveur." });
    }
    res.json(results);
  });
});

// ##############################################################################################################
// #                                             menu Inscription page.                                         #
// ##############################################################################################################

const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  const { Nom, Prenom, Num_AFPA, Password } = req.body;


  if (!Nom || !Prenom || !Num_AFPA || !Password) {
    return res.status(400).json({
      message: "Saisie incorrecte.",
    });
  }


  if (!/^\d+$/.test(Num_AFPA)) {
    return res.status(400).json({
      message: "Le numéro AFPA doit contenir uniquement des chiffres.",
    });
  }

  const sqlCheck = `
    SELECT id_user
    FROM user_
    WHERE Num_AFPA = ?
  `;

  db.query(sqlCheck, [Num_AFPA], async (err, results) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({
        message: "Erreur serveur.",
      });
    }

    if (results.length > 0) {
      return res.status(409).json({
        message: "Ce numéro AFPA est déjà utilisé.",
      });
    }

    // Hash du mot de passe
    const hash = await bcrypt.hash(Password, 10);

    const sql = `
      INSERT INTO user_ (
        id_user,
        Nom,
        Prenom,
        Num_AFPA,
        Password,
        id_role
      )
      VALUES (
        NULL,
        ?,
        ?,
        ?,
        ?,
        ?
      )
    `;

    const values = [Nom, Prenom, Num_AFPA, hash, 4];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Erreur SQL :", err);

        return res.status(500).json({
          message: err.message,
          code: err.code,
          sqlMessage: err.sqlMessage,
        });
      }

      return res.status(201).json({
        message: "Inscription réussie.",
        code: "OK",
        id_user: results.insertId,
      });
    });
  });
});
// ############################################################################################################################################################################################################################
//                                          ##############################################################################################################
//                                          #                                                                                                            #
//                                          #                                          Partie sécurisé                                                   #
//                                          #                                                                                                            #
//                                          ##############################################################################################################
// ############################################################################################################################################################################################################################

// ##############################################################################################################
// #                                             menu login                                                     #
// ##############################################################################################################

const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const { Num_AFPA, Password } = req.body;
  if (!Num_AFPA || !Password) {
    return res.status(400).json({
      message: "Saisie incorrect.",
    });
  }
  if (!/^\d+$/.test(Num_AFPA)) {
    return res.status(400).json({
      message: " Doit contenir uniquement des chiffres.",
    });
  }
  const sql = `
        SELECT *
        FROM user_
        INNER JOIN role ON user_.id_role = role.id_role
        WHERE Num_AFPA = ?
    `;
  const sql2 = `
            SELECT* FROM demande WHERE Num_AFPA_invite = ?
   
  `;

  db.query(sql, [Num_AFPA], async (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(401).json({
        message: "Utilisateur introuvable.",
      });
    }

    const user = result[0];

    const isValid = await bcrypt.compare(Password, user.Password);

    if (!isValid) {
      return res.status(401).json({
        message: "Mot de passe incorrect",
      });
    }
    const sql2 = ` UPDATE demande SET id_demandeur =  ? WHERE Num_AFPA_invite =? AND id_demandeur IS NULL `;

    db.query(sql2, [user.id_user, user.Num_AFPA], (err, updateResult) => {
      if (err) {
        console.error("Erreur lors de l'association des demandes :", err);
      } else {
        console.log(
          `${updateResult.affectedRows} demande(s) associée(s) au compte ${user.id_user}`,
        );
      }
      const token = jwt.sign(
        {
          id_user: user.id_user,
          Num_AFPA: user.Num_AFPA,
          id_role: user.id_role,
          nom: user.Nom,
          prenom: user.Prenom,
          nom_role: user.Nom_role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        },
      );
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      return res.status(200).json({
        message: "Connexion réussie.",
        token: token,
        user: {
          id_user: user.id_user,
          Num_AFPA: user.Num_AFPA,
          id_role: user.id_role,
          nom: user.Nom,
          prenom: user.Prenom,
          nom_role: user.Nom_role,
        },
      });
    });
  });
});

// ##############################################################################################################
// #                                         menu utilisateur                                                   #
// ##############################################################################################################

router.get("/dashboard/utilisateur", auth, (req, res) => {
  const id_user = req.user.id_user;

  const sql = `
SELECT *,(SELECT user_.nom)
FROM demande
INNER JOIN user_
ON demande.id_demandeur = user_.id_user
WHERE demande.id_demandeur = ?
`;
  db.query(sql, [id_user], (err, results) => {
    if (err) {
      console.error("Erreur lors de la requête :", err.message);
      return res.status(500).json({ message: "Erreur serveur." });
    }
    res.json(results);
  });
});

// ##############################################################################################################
// #                                       menu complet pour manageur                                           #
// ##############################################################################################################

router.get("/dashboard/complet", auth, (req, res) => {
  const id_role = req.user.id_role;
  if (id_role === 4) {
    console.log(id_role);

    return res.status(403).json({ message: "Accès refusé." });
  }

  const sql = `
SELECT
    demande.*,
    user_.Nom AS Nom_positionneur,
    user_.Prenom AS Prenom_positionneur
FROM demande
LEFT JOIN user_
    ON demande.id_positionneur = user_.id_user
`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la requête :", err.message);
      return res.status(500).json({ message: "Erreur serveur." });
    }
    res.json(results);
  });
});
// ##############################################################################################################
// #                                       menu complet  formateur et tech                                      #
// ##############################################################################################################

router.get("/dashboard/formateur_technicien", auth, (req, res) => {
  const id_role = req.user.id_role;
  if (id_role !== 2 && id_role !== 3) {
    console.log(id_role);

    return res.status(403).json({ message: "Accès refusé" });
  }

  const sql = `
SELECT
    demande.*,
    user_.Nom AS Nom_positionneur,
    user_.Prenom AS Prenom_positionneur
FROM demande
LEFT JOIN user_
    ON demande.id_positionneur = user_.id_user
`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la requête :", err.message);
      return res.status(500).json({ message: "Erreur serveur." });
    }
    res.json(results);
  });
});
// ##############################################################################################################
// #                                         route modif status                                                #
// ##############################################################################################################

router.put("/dashboard/complet/update/:id_demande", auth, function (req, res, next) {
  const id = req.params.id_demande;
  const id_role = req.user.id_role;
  if (id_role !== 1 && id_role !== 2 && id_role !== 3) {
    return res.status(403).json({ message: "Accès refusé." });
  }
  if (!req.body.id_status) {
    return res.status(400).json({
      message: "Saisie incorrect.",
    });
  }
  const sql = " UPDATE demande SET id_status = ? WHERE id_demande=? ";

  db.query(sql, [req.body.id_status, id], (err, result) => {
    if (err) {
      console.error("Erreur SQL :", err);

      return res.status(500).json({
        message: err.message,
        code: err.code,
        sqlMessage: err.sqlMessage,
      });
    } else {
      return res.status(200).json({
        message: "Status modifié.",
        code: "OK",
      });
    }
  });
},
);

// ##############################################################################################################
// #                                             changement de réaliser                                         #
// ##############################################################################################################

router.put(
  "/dashboard/complet/update/realise/:id_demande",
  auth,
  function (req, res, next) {
    const id = req.params.id_demande;
    const id_role = req.user.id_role;
    if (id_role !== 1) {
      return res.status(403).json({ message: "Accès refusé." });
    }
    const sql = ` UPDATE demande SET realise = 1, Date_realise = ? WHERE id_demande=? `;

    db.query(
      sql,
      [moment().format("YYYY-MM-DD HH:mm:ss"), id],
      (err, result) => {
        if (err) {
          console.error("Erreur SQL :", err);

          return res.status(500).json({
            message: err.message,
            code: err.code,
            sqlMessage: err.sqlMessage,
          });
        } else {
          return res.status(200).json({
            message: "Réalisation faite.",
            code: "OK",
          });
        }
      },
    );
  },
);

// ##############################################################################################################
// #                                             messagerie instantané                                          #
// ##############################################################################################################

router.post("/dashboard/complet/messagerie/:id_demande", auth, (req, res) => {
  const id = req.params.id_demande;
  const id_role = req.user.id_role;
  const { id_message, Date_heure, Message } = req.body;
  if (id_role === 4) {
    console.log(id_role);

    return res.status(403).json({ message: "Accès refusé." });
  }
  if (!req.body.Message) {
    return res.status(400).json({
      message: "Saisie incorrect.",
    })
  };
  const sql = `
    INSERT INTO message (
      id_message,
      Date_heure,
      Message,
      id_demande
    )
    VALUES (
      NULL,
      ?,
      ?,
      ?
    )
  `;
  const sql2 =
    ` SELECT * FROM message WHERE id_demande = ? `;


  db.query(
    sql,
    [moment().format("YYYY-MM-DD HH:mm:ss"), req.body.Message, id],
    (err, results) => {
      if (err) {
        console.error("Erreur SQL :", err);

        return res.status(500).json({
          message: err.message,
          code: err.code,
          sqlMessage: err.sqlMessage,
        });
      }

      db.query(sql2, [id], (err, results) => {
        if (err) {
          console.error("Erreur lors de la requête :", err.message);
          return res.status(500).json({ message: "Erreur serveur." });
        }
        res.json(results);
      });
    },
  );
});

router.get("/dashboard/complet/messagerie/:id_demande", auth, (req, res) => {
  const id_demande = req.params.id_demande;

  const sql2 = `SELECT * FROM message WHERE id_demande = ?`;

  db.query(sql2, [id_demande], (err, results) => {
    if (err) {
      console.error("Erreur SQL lecture messages :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    res.json(results);
  });
});

// ##############################################################################################################
// #                                             Request utilisateur page                                       #
// ##############################################################################################################

router.post("/dashboard/utilisateur/request", auth, (req, res) => {
  const id_user = req.user.id_user;
  if (!req.body.Description || !req.body.id_status) {
    return res.status(400).json({
      message: "Saisie incorrect.",
    });
  }
  const sql = `
    INSERT INTO demande (
      id_demande,
      Description,
      Date_creation,
      realise,
      id_status,
      id_demandeur,
      id_technicien,
      id_positionneur,
      Date_realise
    )
    VALUES (
      NULL,
      ?,
      ?,
      ?,
      ?,
      ?,
      NULL,
      NULL,
      NULL
    )
  `;

  db.query(
    sql,
    [
      req.body.Description,
      moment().format("YYYY-MM-DD HH:mm:ss"),
      0,
      req.body.id_status,
      id_user,
    ],
    (err, result) => {
      if (err) {
        console.error("Erreur SQL :", err);

        return res.status(500).json({
          message: err.message,
          code: err.code,
          sqlMessage: err.sqlMessage,
        });
      } else {
        return res.status(200).json({
          message: "Demande ajoutée.",
          code: "OK",
        });
      }
    },
  );
});

// ##############################################################################################################
// #                                             changement de role                                             #
// ##############################################################################################################

router.put(
  "/dashboard/complet/update/role/:id_user",
  auth,
  function (req, res, next) {
    const id_user = req.params.id_user;
    const id_role = req.user.id_role;
    if (id_role !== 1) {
      return res.status(403).json({ message: "Accès refusé." });
    }
    if (!req.body.id_role) {
      return res.status(400).json({
        message: "Saisie incorrect.",
      });
    }
    const sql = ` UPDATE user_ SET id_role = ? WHERE id_user=?  `;

    db.query(sql, [req.body.id_role, id_user], (err, result) => {
      if (err) {
        console.error("Erreur SQL :", err);

        return res.status(500).json({
          message: err.message,
          code: err.code,
          sqlMessage: err.sqlMessage,
        });
      } else {
        return res.status(200).json({
          message: "Role modifié.",
          code: "OK",
        });
      }
    });
  },
);

// ##############################################################################################################
// #                                             supprime utilisateur                                           #
// ##############################################################################################################

router.delete(
  "/dashboard/complet/delete/utilisateur/:id_user",
  auth,
  function (req, res, next) {
    const id_user = req.params.id_user;
    const id_role = req.user.id_role;
    if (id_role !== 1) {
      return res.status(403).json({ message: "Accès refusé." });
    }
    const sql = ` DELETE FROM user_  WHERE id_user=?  `;

    db.query(sql, [id_user], (err, result) => {
      if (err) {
        console.error("Erreur SQL :", err);

        return res.status(500).json({
          message: err.message,
          code: err.code,
          sqlMessage: err.sqlMessage,
        });
      } else {
        return res.status(200).json({
          message: "Utilisateur supprimé.",
          code: "OK",
        });
      }
    });
  },
);
// ##############################################################################################################
// #                                             supprime demande                                               #
// ##############################################################################################################
router.delete(
  "/dashboard/complet/delete/demande/:id_demande",
  auth,
  function (req, res, next) {
    const id_demande = req.params.id_demande;
    const id_role = req.user.id_role;
    if (id_role !== 1) {
      return res.status(403).json({ message: "Accès refusé." });
    }
    const sql = ` DELETE FROM demande WHERE id_demande=?  `;

    db.query(sql, [id_demande], (err, result) => {
      if (err) {
        console.error("Erreur SQL :", err);

        return res.status(500).json({
          message: err.message,
          code: err.code,
          sqlMessage: err.sqlMessage,
        });
      } else {
        return res.status(200).json({
          message: "Demande supprimée.",
          code: "OK",
        });
      }
    });
  },
);

// ##############################################################################################################
// #                                             positionnement formateur                                       #
// ##############################################################################################################

router.put(
  "/dashboard/complet/uptade/posionnement/:id_demande",
  auth,
  function (req, res, next) {
    const id_demande = req.params.id_demande;
    const id_role = req.user.id_role;
    const id_user = req.user.id_user;
    if (id_role !== 2) {
      return res.status(403).json({ message: "Accès refusé." });
    }
    const sql = ` UPDATE demande SET id_positionneur = ? WHERE id_demande=? `;
    db.query(sql, [id_user, id_demande], (err, result) => {
      if (err) {
        console.error("Erreur SQL :", err);

        return res.status(500).json({
          message: err.message,
          code: err.code,
          sqlMessage: err.sqlMessage,
        });
      } else {
        return res.status(200).json({
          message: "Positionnement effectué.",
          code: "OK",
        });
      }
    });
  },
);

// ##############################################################################################################
// #                                             validation manageur                                            #
// ##############################################################################################################

router.put(
  "/dashboard/complet/uptade/validation/:id_demande",
  auth,
  function (req, res, next) {
    const id_demande = req.params.id_demande;
    const id_role = req.user.id_role;

    if (id_role !== 1) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const sql = `
      UPDATE demande
      SET id_technicien = id_positionneur
      WHERE id_demande = ?
    `;

    db.query(sql, [id_demande], (err, result) => {
      if (err) {
        console.error("Erreur SQL :", err);

        return res.status(500).json({
          message: err.message,
          code: err.code,
          sqlMessage: err.sqlMessage,
        });
      }

      return res.status(200).json({
        message: "Changement accepté",
        code: "OK",
      });
    });
  }
);

// ##############################################################################################################
// #                                             refus manageur                                                 #
// ##############################################################################################################

router.put(
  "/dashboard/complet/uptade/refus/:id_demande",
  auth,
  function (req, res, next) {
    const id_demande = req.params.id_demande;
    const id_role = req.user.id_role;

    if (id_role !== 1) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const sql = `
      UPDATE demande
      SET id_positionneur = 1
      WHERE id_demande = ?
    `;

    db.query(sql, [id_demande], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
          code: err.code,
          sqlMessage: err.sqlMessage,
        });
      }

      return res.status(200).json({
        message: "Positionnement refusé.",
        code: "OK",
      });
    });
  }
);

// ##############################################################################################################
//                                     Graphique                                                                  #
// ##############################################################################################################

router.get("/dashboard/manageur/graphique", auth, (req, res) => {
  const id = req.params.id_demande;
  const id_role = req.user.id_role;
  if (id_role !== 1) {
    console.log(id_role);

    return res.status(403).json({ message: "Accès refusé" });
  }

  const sql = `
SELECT 
    MONTH(Date_creation) AS mois, 
    COUNT(id_demande) AS crees,
SUM(CASE WHEN realise = 1 THEN 1 ELSE 0 END) AS realisees
FROM demande 
GROUP BY MONTH(Date_creation)
ORDER BY MONTH(Date_creation);
`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la requête :", err.message);
      return res.status(500).json({ message: "Erreur serveur." });
    }
    res.json(results);
  });
});













module.exports = router;
