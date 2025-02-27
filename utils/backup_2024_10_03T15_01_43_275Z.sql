-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: localhost    Database: panel_internet
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `ID_Admin` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `permisos` tinyint DEFAULT NULL,
  PRIMARY KEY (`ID_Admin`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (2,'admin','prueba',NULL,1),(3,'adminnnnnn','segundo','admin2@gmail.com',0);
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asociaciones`
--

DROP TABLE IF EXISTS `asociaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asociaciones` (
  `ID_asociacion` int NOT NULL AUTO_INCREMENT,
  `ID_Comercio` int DEFAULT NULL,
  `ID_Cliente` int DEFAULT NULL,
  PRIMARY KEY (`ID_asociacion`),
  KEY `FK_Asoc_ID_Cliente_idx` (`ID_Cliente`),
  KEY `FK_Asoc_ID_Comercio_idx` (`ID_Comercio`),
  CONSTRAINT `FK_Asoc_ID_Cliente` FOREIGN KEY (`ID_Cliente`) REFERENCES `clientes` (`ID_Cliente`),
  CONSTRAINT `FK_Asoc_ID_Comercio` FOREIGN KEY (`ID_Comercio`) REFERENCES `comercio` (`ID_Comercio`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asociaciones`
--

LOCK TABLES `asociaciones` WRITE;
/*!40000 ALTER TABLE `asociaciones` DISABLE KEYS */;
INSERT INTO `asociaciones` VALUES (4,41,314),(5,41,319);
/*!40000 ALTER TABLE `asociaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `ID_Cliente` int NOT NULL AUTO_INCREMENT,
  `dni` decimal(10,0) DEFAULT NULL,
  `direccion_principal` varchar(200) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `Id` varchar(255) DEFAULT NULL,
  `Codigo` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `activo` tinyint DEFAULT NULL,
  PRIMARY KEY (`ID_Cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=320 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (311,12414,'',NULL,'123','123','','valverde',NULL),(312,12414,'faf','addf','123','123','fede','valverde',0),(313,4214124,'Alsina 123','juangomez@gmail.com','1234','1234','Juan','Gomez Perez',0),(314,424,'fds','adfs','123','123','fds','fds',1),(315,4124,'fads','afds','12','123','fdsf','adfs',1),(316,412,'adfs','adfs ','51251125','1551','fds','adfs',1),(317,42414,'fasd','fads','123','123','fad','fads',1),(318,1,'f','f','123456','12343','f','f',1),(319,40,'pedrinho','pedro@gmail.com','999','888','pedro','picapiedras',1);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comercio`
--

DROP TABLE IF EXISTS `comercio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comercio` (
  `ID_Comercio` int NOT NULL AUTO_INCREMENT,
  `nombre_comercio` varchar(200) DEFAULT NULL,
  `nombre_completo` varchar(200) DEFAULT NULL,
  `telefono` bigint DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `porcentaje` float DEFAULT NULL,
  `activo` tinyint DEFAULT NULL,
  `rubro` varchar(255) DEFAULT NULL,
  `puntos_totales` decimal(8,2) DEFAULT NULL,
  PRIMARY KEY (`ID_Comercio`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comercio`
--

LOCK TABLES `comercio` WRITE;
/*!40000 ALTER TABLE `comercio` DISABLE KEYS */;
INSERT INTO `comercio` VALUES (41,'Comercio ','Comercio de prueba',20349294,'comercio@gmail.com','Comercio 123',5,1,'Comercios',150.00),(42,'comercio2','comercio nuevo',4124,'comercio2@gmail.com','aa',2,1,'comercios',0.00);
/*!40000 ALTER TABLE `comercio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fecha`
--

DROP TABLE IF EXISTS `fecha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fecha` (
  `ID_Fecha` int NOT NULL,
  `fecha` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Fecha`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fecha`
--

LOCK TABLES `fecha` WRITE;
/*!40000 ALTER TABLE `fecha` DISABLE KEYS */;
INSERT INTO `fecha` VALUES (1,'1727924400000');
/*!40000 ALTER TABLE `fecha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial`
--

DROP TABLE IF EXISTS `historial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial` (
  `ID_Historial` int NOT NULL AUTO_INCREMENT,
  `message` varchar(255) DEFAULT NULL,
  `fecha` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Historial`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial`
--

LOCK TABLES `historial` WRITE;
/*!40000 ALTER TABLE `historial` DISABLE KEYS */;
INSERT INTO `historial` VALUES (1,'Se agrego el cliente Probando','1727392100317'),(2,'Se agregaron asociaciones de clientes al comercio cristian','1727392901942'),(3,'Se agrego el admin nuevo','1727393998760'),(4,'Se agrego el cliente Probando','1727722007557'),(5,'Se agrego el cliente rdsr','1727722038317'),(6,'Se agrego el cliente probando','1727722171011'),(7,'Se agregaron asociaciones de comercios al cliente probando','1727722201042'),(8,'Se agrego el comercio Nuevo','1727722337535'),(9,'Se agregaron asociaciones de clientes al comercio Nuevo','1727722439726'),(10,'Se agrego una transaccion del cliente probando en el comercio Nuevo','1727722780044'),(11,'Se agrego una transaccion del cliente probando en el comercio Nuevo','1727723049797'),(12,'Se agrego una transaccion del cliente probando en el comercio Nuevo','1727723210792'),(13,'Se agrego una transaccion del cliente probando en el comercio Nuevo','1727723507168'),(14,'Se agrego una transaccion del cliente probando en el comercio Nuevo','1727723638905'),(15,'Se agrego un pago del comercio Nuevo','1727723848247'),(16,'Se agrego un pago del comercio Nuevo','1727724552697'),(17,'Se agrego el admin admin','1727725784085'),(18,'Se agrego el admin admin','1727726466262'),(19,'Se agrego una transaccion del cliente probando en el comercio cristian','1727727440254'),(20,'Se agrego una transaccion del cliente probando en el comercio MOUS','1727727465792'),(21,'Se agrego una transaccion del cliente probando en el comercio Nuevo','1727727509153'),(22,'Se actualiazo la fecha de caducación de los puntos','1727878613274'),(23,'Se actualiazo la fecha de caducación de los puntos','1727879210914'),(24,'Se actualiazo la fecha de caducación de los puntos','1727879235248'),(25,'Se actualiazo la fecha de caducación de los puntos','1727879407400'),(26,'Se actualiazo la fecha de caducación de los puntos','1727879411802'),(27,'Se actualiazo la fecha de caducación de los puntos','1727879479140'),(28,'Se actualiazo la fecha de caducación de los puntos','1727879583968'),(29,'Se actualiazo la fecha de caducación de los puntos','1727879587191'),(30,'Se actualiazo la fecha de caducación de los puntos','1727879602065'),(31,'Se actualiazo la fecha de caducación de los puntos','1727879604362'),(32,'Se actualiazo la fecha de caducación de los puntos','1727879814105'),(33,'Se actualiazo la fecha de caducación de los puntos','1727879817213'),(34,'Se actualiazo la fecha de caducación de los puntos','1727879819860'),(35,'Se modifico el cliente probando','1727891604492'),(36,'Se agrego el comercio Comercio ','1727892501794'),(37,'Se agregaron asociaciones de clientes al comercio Comercio ','1727892510779'),(38,'Se agrego una transaccion del cliente probando en el comercio Comercio ','1727892529744'),(39,'Se borro una transaccion del cliente probando en el comercio Comercio ','1727893809137'),(40,'Se agrego una transaccion del cliente probando en el comercio Comercio ','1727893830874'),(41,'Se agrego un pago del comercio Comercio ','1727893838919'),(42,'Se borro un pago del comercio Comercio ','1727894400002'),(43,'Se agregaron asociaciones de clientes al comercio Comercio ','1727894674269'),(44,'Se borro la asociaciones del cliente probando con el comercio Comercio ','1727894679124'),(45,'Se agrego el cliente aff','1727894747192'),(46,'Se agregaron asociaciones de clientes al comercio Comercio ','1727895073310'),(47,'Se borraron las asociaciones del cliente: probando','1727895541081'),(48,'Se borraron las transacciones del cliente: probando','1727895542385'),(49,'Se borraron los puntos del cliente: probando','1727895543756'),(50,'Se borro el cliente probando','1727895544858'),(51,'Se agrego el admin admin','1727895619246'),(52,'Se borro el admin admin','1727895961205'),(53,'Se borro el admin admin','1727896044674'),(54,'Se borro el admin admin','1727896346327'),(55,'Se borro el cliente fede','1727896787591'),(56,'Se agrego el cliente fede','1727896876934'),(57,'Se modifico el cliente undefined','1727896881663'),(58,'Se agrego el admin admin','1727897420222'),(59,'Se agrego el comercio comercio2','1727907407111'),(60,'Se creo exitosamente el backup','1727958206478'),(61,'Se agrego el cliente Juan','1727958271620'),(62,'Se modifico el cliente Juan','1727958283342'),(63,'Se modifico el cliente undefined','1727958288574'),(64,'Se actualizo el admin admin','1727958913138'),(65,'Se agrego el admin admin','1727959292969'),(66,'Se actualizo el admin admin','1727959716193'),(67,'Se actualizo el admin admin','1727959764329'),(68,'Se actualizo el admin admin','1727959936722'),(69,'Se actualizo el admin admin','1727961368801'),(70,'Se actualizo el admin adminnnnnn','1727961390096'),(71,'Se actualizo el admin adminnnnnn','1727961579954'),(72,'Se creo exitosamente el backup','1727963804593'),(73,'Se agrego el cliente fds','1727964280952'),(74,'Se creo exitosamente el backup','1727964508000'),(75,'Se creo exitosamente el backup','1727964510000'),(76,'Se creo exitosamente el backup','1727964510000'),(77,'Se creo exitosamente el backup','1727964593000'),(78,'Se creo exitosamente el backup','1727964621000'),(79,'Se agrego el cliente fdsf','1727964652000'),(80,'Se agrego el cliente fds','1727964720000'),(81,'Se agrego el cliente fad','1727965713000'),(82,'Se agrego el cliente f','1727965990000'),(83,'Se agregaron asociaciones de comercios al cliente fds','1727966115000'),(84,'Se agrego una transaccion del cliente fds en el comercio Comercio ','1727966142000'),(85,'Se agrego el cliente pedro','1727966348000'),(86,'Se agregaron asociaciones de comercios al cliente pedro','1727966354000'),(87,'Se agrego una transaccion del cliente pedro en el comercio Comercio ','1727966381000'),(88,'Se actualizo el admin adminnnnnn','1727966818000'),(89,'Se actualizo el admin adminnnnnn','1727967446000'),(90,'Se creo exitosamente el backup','1727967703000');
/*!40000 ALTER TABLE `historial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `ID_Pagos` int NOT NULL AUTO_INCREMENT,
  `ID_Comercio` int NOT NULL,
  `monto_parcial` decimal(8,2) DEFAULT NULL,
  `fecha` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Pagos`),
  KEY `FK_pagos_comercio_idx` (`ID_Comercio`),
  CONSTRAINT `FK_pagos_comercio` FOREIGN KEY (`ID_Comercio`) REFERENCES `comercio` (`ID_Comercio`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos` (
  `ID_Permisos` int NOT NULL AUTO_INCREMENT,
  `ID_Comercio` int NOT NULL,
  `ID_Admin` varchar(255) NOT NULL,
  PRIMARY KEY (`ID_Permisos`),
  KEY `ID_Comercio_idx` (`ID_Comercio`),
  CONSTRAINT `FK_ID_Comercio` FOREIGN KEY (`ID_Comercio`) REFERENCES `comercio` (`ID_Comercio`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
INSERT INTO `permisos` VALUES (2,41,'admin@gmail.com'),(3,41,'admin2@gmail.com');
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puntos`
--

DROP TABLE IF EXISTS `puntos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puntos` (
  `ID_Puntos` int NOT NULL AUTO_INCREMENT,
  `ID_Cliente` int NOT NULL,
  `puntos` decimal(8,2) DEFAULT NULL,
  `fecha` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Puntos`),
  KEY `ID_Cliente` (`ID_Cliente`),
  CONSTRAINT `puntos_ibfk_1` FOREIGN KEY (`ID_Cliente`) REFERENCES `clientes` (`ID_Cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntos`
--

LOCK TABLES `puntos` WRITE;
/*!40000 ALTER TABLE `puntos` DISABLE KEYS */;
INSERT INTO `puntos` VALUES (13,314,50.00,'1727966141582'),(14,319,50.00,'1727966379119');
/*!40000 ALTER TABLE `puntos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transacciones`
--

DROP TABLE IF EXISTS `transacciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transacciones` (
  `ID_Transaccion` int NOT NULL AUTO_INCREMENT,
  `ID_Comercio` int DEFAULT NULL,
  `ID_Cliente` int DEFAULT NULL,
  `monto_parcial` decimal(8,2) DEFAULT NULL,
  `puntos_parciales` decimal(8,2) DEFAULT NULL,
  `fecha` varchar(255) DEFAULT NULL,
  `puntos_pago` decimal(8,2) DEFAULT NULL,
  PRIMARY KEY (`ID_Transaccion`),
  KEY `FK_Trans_ID_Comercio_idx` (`ID_Comercio`),
  KEY `FK_Trans_ID_Cliente_idx` (`ID_Cliente`),
  CONSTRAINT `FK_Trans_ID_Cliente` FOREIGN KEY (`ID_Cliente`) REFERENCES `clientes` (`ID_Cliente`),
  CONSTRAINT `FK_Trans_ID_Comercio` FOREIGN KEY (`ID_Comercio`) REFERENCES `comercio` (`ID_Comercio`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transacciones`
--

LOCK TABLES `transacciones` WRITE;
/*!40000 ALTER TABLE `transacciones` DISABLE KEYS */;
INSERT INTO `transacciones` VALUES (3,41,314,1000.00,50.00,'1727966141582',NULL),(4,41,319,1000.00,50.00,'1727966379119',NULL);
/*!40000 ALTER TABLE `transacciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('cliente','admin','comercio','superadmin') NOT NULL,
  UNIQUE KEY `userId_UNIQUE` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('1b88918b-4446-4f4e-b7b4-4e744ddcfbce','superadmin@gmail.com','$2b$10$DBMlie2hOBpMNo8qKRr1X.0VxsJhntvbKd.CweFzG1VGC1zTk6WCq','superadmin'),('3604d157-c647-443e-832c-ec9a5d9612ab','comercio@gmail.com','$2b$10$bM6foc8ptS9uocMGyswss.jI/lSVQqpAow9an1aDGxfqK5Mr9lHp6','comercio'),('44f1e73a-f3a8-42a5-a8bb-76fb07f7e7a8','comercio2@gmail.com','$2b$10$C1vjY7aLX03xdeSN0PS3EePkf.DQV2RUwbLSKUG0QnYKk4gWTENue','comercio'),('61e614e7-8165-44b2-ad2d-98d97c850bc7','admin@gmail.com','$2b$10$5s6lNHyd.2.3iQLknaEy0u/.hukYDuErB904BQe/6p3kXBYdFfr4O','admin'),('875ec67f-b73b-4952-94f3-c70d7b751cf7','admin2@gmail.com','$2b$10$5tL7C/6vKfid1H0QJFZ/sOmPg9R0XRpirEBfo9FQCNQwp82d6G/lS','admin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-03 12:01:43
