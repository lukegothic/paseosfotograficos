-- phpMyAdmin SQL Dump
-- version 4.1.14.8
-- http://www.phpmyadmin.net
--
-- Host: db645461664.db.1and1.com
-- Generation Time: Mar 18, 2017 at 10:55 AM
-- Server version: 5.5.54-0+deb7u2-log
-- PHP Version: 5.4.45-0+deb7u7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `db645461664`
--

-- --------------------------------------------------------

--
-- Table structure for table `fotos`
--

CREATE TABLE IF NOT EXISTS `fotos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(1024) COLLATE latin1_spanish_ci NOT NULL,
  `fecha` datetime NOT NULL,
  `lugar` point NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `fotosxpaseo`
--

CREATE TABLE IF NOT EXISTS `fotosxpaseo` (
  `paseoid` bigint(20) NOT NULL,
  `fotoid` bigint(20) NOT NULL,
  `orden` int(11) DEFAULT NULL,
  PRIMARY KEY (`paseoid`,`fotoid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Dumping data for table `fotosxpaseo`
--

INSERT INTO `fotosxpaseo` (`paseoid`, `fotoid`, `orden`) VALUES
(1, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `paseos`
--

CREATE TABLE IF NOT EXISTS `paseos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(1024) COLLATE latin1_spanish_ci NOT NULL,
  `ruta` linestring NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci AUTO_INCREMENT=48 ;

--
-- Dumping data for table `paseos`
--

INSERT INTO `paseos` (`id`, `titulo`, `ruta`) VALUES
(47, '', ''),
(46, '', ''),
(45, '', ''),
(44, '', ''),
(43, '', ''),
(42, '', ''),
(41, '', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
