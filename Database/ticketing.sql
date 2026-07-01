-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 01 juil. 2026 à 14:02
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ticketing`
--

-- --------------------------------------------------------

--
-- Structure de la table `demande`
--

CREATE TABLE `demande` (
  `id_demande` int(11) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `Date_creation` datetime NOT NULL,
  `Num_AFPA_invite` int(11) DEFAULT NULL,
  `Nom_AFPA_invite` varchar(50) DEFAULT NULL,
  `Prenom_AFPA_invite` varchar(50) DEFAULT NULL,
  `realise` tinyint(1) NOT NULL,
  `id_status` int(11) DEFAULT NULL,
  `id_demandeur` int(11) DEFAULT NULL,
  `id_technicien` int(11) DEFAULT NULL,
  `id_positionneur` int(11) DEFAULT NULL,
  `Date_realise` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `envoi`
--

CREATE TABLE `envoi` (
  `id_user` int(11) NOT NULL,
  `id_message` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

CREATE TABLE `message` (
  `id_message` int(11) NOT NULL,
  `Date_heure` datetime NOT NULL,
  `Message` varchar(255) NOT NULL,
  `id_demande` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

CREATE TABLE `role` (
  `id_role` int(11) NOT NULL,
  `Nom_role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `role`
--

INSERT INTO `role` (`id_role`, `Nom_role`) VALUES
(1, 'Manageur'),
(2, 'Formateur'),
(3, 'Technicien'),
(4, 'Utilisateur');

-- --------------------------------------------------------

--
-- Structure de la table `status`
--

CREATE TABLE `status` (
  `id_status` int(11) NOT NULL,
  `Nom_status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `status`
--

INSERT INTO `status` (`id_status`, `Nom_status`) VALUES
(1, 'urgent'),
(2, 'peu attendre'),
(3, 'pressant');

-- --------------------------------------------------------

--
-- Structure de la table `user_`
--

CREATE TABLE `user_` (
  `id_user` int(11) NOT NULL,
  `Nom` varchar(50) NOT NULL,
  `Prenom` varchar(50) NOT NULL,
  `Num_AFPA` int(11) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `id_role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_`
--

INSERT INTO `user_` (`id_user`, `Nom`, `Prenom`, `Num_AFPA`, `Password`, `id_role`) VALUES
(8, 'josé', 'garcia', 1418020303, '$2b$10$NVvUPJxLKAp0booVxOQbNeWKTQNNretlpEjQWkiCJ7MUlu7VnOXga', 3),
(9, 'joséphine', 'garcia', 1418020304, '$2b$10$lLtF7wK7DfrnqkA8YZtwPeTRBlTlTwFDtsE1kgTzl17IMZbhjkDv2', 1),
(11, 'saquet', 'bilbo', 1418020305, '$2b$10$R40AEXJ0o6CGXJoHb1kwzexFTAvOFtBYrzktouPp2WT1fwz8G60xK', 2),
(14, 'Lord Gay', 'DeBUSSY', 123456789, '$2b$10$ty5M5a.Bbl5miaqMn6t5OezysNFXNSXvvn/Z/2gg4lIi.0XQAEPaW', 4);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `demande`
--
ALTER TABLE `demande`
  ADD PRIMARY KEY (`id_demande`),
  ADD KEY `id_demandeur` (`id_demandeur`),
  ADD KEY `id_technicien` (`id_technicien`),
  ADD KEY `id_validateur` (`id_positionneur`),
  ADD KEY `Demande_ibfk_1` (`id_status`);

--
-- Index pour la table `envoi`
--
ALTER TABLE `envoi`
  ADD PRIMARY KEY (`id_user`,`id_message`),
  ADD KEY `envoi_ibfk_2` (`id_message`);

--
-- Index pour la table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id_message`),
  ADD KEY `Message_ibfk_1` (`id_demande`);

--
-- Index pour la table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id_role`);

--
-- Index pour la table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id_status`);

--
-- Index pour la table `user_`
--
ALTER TABLE `user_`
  ADD PRIMARY KEY (`id_user`),
  ADD KEY `User__ibfk_1` (`id_role`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `demande`
--
ALTER TABLE `demande`
  MODIFY `id_demande` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

--
-- AUTO_INCREMENT pour la table `message`
--
ALTER TABLE `message`
  MODIFY `id_message` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `role`
--
ALTER TABLE `role`
  MODIFY `id_role` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `status`
--
ALTER TABLE `status`
  MODIFY `id_status` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `user_`
--
ALTER TABLE `user_`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `demande`
--
ALTER TABLE `demande`
  ADD CONSTRAINT `Demande_ibfk_1` FOREIGN KEY (`id_status`) REFERENCES `status` (`id_status`);

--
-- Contraintes pour la table `envoi`
--
ALTER TABLE `envoi`
  ADD CONSTRAINT `envoi_ibfk_2` FOREIGN KEY (`id_message`) REFERENCES `message` (`id_message`);

--
-- Contraintes pour la table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `Message_ibfk_1` FOREIGN KEY (`id_demande`) REFERENCES `demande` (`id_demande`);

--
-- Contraintes pour la table `user_`
--
ALTER TABLE `user_`
  ADD CONSTRAINT `User__ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
