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
INSERT INTO `admins` VALUES (1,'eduardo','eduardo','eduardo@gmail.com',1),(2,'evelin','miranda','evelin@gmail.com',0),(3,'MARIO','MARIO','MARIO@GMAIL.COM',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asociaciones`
--

LOCK TABLES `asociaciones` WRITE;
/*!40000 ALTER TABLE `asociaciones` DISABLE KEYS */;
INSERT INTO `asociaciones` VALUES (1,43,317),(2,43,319),(3,43,316),(4,43,318),(5,43,315),(6,43,314),(7,44,318),(8,44,317),(9,44,316),(10,44,319),(11,44,314),(12,44,315),(13,43,321),(14,43,322),(15,45,321),(16,45,318),(17,45,319),(18,45,322),(19,45,314),(20,45,315),(21,45,316),(22,45,317);
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
) ENGINE=InnoDB AUTO_INCREMENT=323 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (311,12414,'',NULL,'123','123','','valverde',NULL),(312,12414,'faf','addf','123','123','fede','valverde',0),(313,4214124,'Alsina 123','juangomez@gmail.com','1234','1234','Juan','Gomez Perez',0),(314,424,'fds','adfs','123','123','fds','fds',1),(315,4124,'fads','afds','12','123','fdsf','adfs',1),(316,412,'adfs','adfs ','51251125','1551','fds','adfs',1),(317,42414,'fasd','fads','123','123','andres','andres',1),(318,1,'f','f','123456','12343','f','f',1),(319,40,'pedrinho','pedro@gmail.com','999','888','pedro','picapiedras',1),(320,29983036,'los aromos 368','eduardocisterna33@gmail.com','1','1','eduardo','cisterna',0),(321,29983036,'juan 123','juan@gmail.com','juan','juan','juan','juan',1),(322,29983036,'eduardo','edua@gmail.com','edu','edu','eduardo','eduardo',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comercio`
--

LOCK TABLES `comercio` WRITE;
/*!40000 ALTER TABLE `comercio` DISABLE KEYS */;
INSERT INTO `comercio` VALUES (43,'MOUS','Maxi Cuenca',5555,'maxi@gmail.com','cabin 9',10,1,'Panaderia',7898.00),(44,'polleria','pollo loco',77777,'polleria@gmail.com','cabin 9',5,1,'polleria',0.00),(45,'PUENTE','Pepito Perez',555555555,'PUENTE@GMAIL.COM','PUENTE',8,1,'ALMACEN',5.24);
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
INSERT INTO `fecha` VALUES (1,'1728529200000');
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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial`
--

LOCK TABLES `historial` WRITE;
/*!40000 ALTER TABLE `historial` DISABLE KEYS */;
INSERT INTO `historial` VALUES (1,'Se actualizo la fecha de caducación de los puntos','1727976398000'),(2,'Se actualizo la fecha de caducación de los puntos','1727976420000'),(3,'Se creo exitosamente el backup','1727976876000'),(4,'Se agrego el cliente eduardo','1727977296000'),(5,'Se modifico el cliente undefined','1727977383000'),(6,'Se modifico el cliente andres','1727977410000'),(7,'Se agrego el comercio MOUS','1727977741000'),(8,'Se agrego el comercio polleria','1727977808000'),(9,'Se agrego el admin eduardo','1727978094000'),(10,'Se actualizo el admin eduardo','1727978101000'),(11,'Se agregaron asociaciones de clientes al comercio MOUS','1727978271000'),(12,'Se agregaron asociaciones de clientes al comercio MOUS','1727978284000'),(13,'Se agregaron asociaciones de clientes al comercio MOUS','1727978293000'),(14,'Se agregaron asociaciones de clientes al comercio polleria','1727978300000'),(15,'Se agrego una transaccion del cliente andres en el comercio MOUS','1727979678000'),(16,'Se agrego una transaccion del cliente pedro en el comercio MOUS','1727980521000'),(17,'Se agrego el admin evelin','1727980752000'),(18,'Se actualizo la fecha de caducación de los puntos','1728069470000'),(19,'Se agrego un pago del comercio MOUS','1728069730000'),(20,'Se agrego una transaccion del cliente andres en el comercio MOUS','1728495117000'),(21,'Se agrego el cliente juan','1728495311000'),(22,'Se actualizo el admin evelin','1728495385000'),(23,'Se actualizo el admin eduardo','1728495395000'),(24,'Se actualizo el admin evelin','1728495408000'),(25,'Se actualizo el admin eduardo','1728495417000'),(26,'Se agrego el cliente eduardo','1728564403000'),(27,'Se agrego una transaccion del cliente eduardo en el comercio MOUS','1728765682000'),(28,'Se agrego el comercio PUENTE','1728765929000'),(29,'Se agregaron asociaciones de clientes al comercio PUENTE','1728766100000'),(30,'Se agrego una transaccion del cliente juan en el comercio PUENTE','1728766399000'),(31,'Se agrego el admin MARIO','1728766653000'),(32,'Se agrego un pago del comercio PUENTE','1728766691000'),(33,'Se agrego un pago del comercio PUENTE','1728766757000'),(34,'Se agrego un pago del comercio PUENTE','1728766860000'),(35,'Se creo exitosamente el backup','1728767907000');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
INSERT INTO `pagos` VALUES (1,43,100.00,'1728069730000'),(2,45,30.00,'1728766691000'),(3,45,7.00,'1728766757000'),(4,45,2.00,'1728766860000');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
INSERT INTO `permisos` VALUES (1,44,'eduardo@gmail.com'),(2,43,'eduardo@gmail.com'),(3,43,'evelin@gmail.com'),(4,44,'evelin@gmail.com'),(5,45,'MARIO@GMAIL.COM');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntos`
--

LOCK TABLES `puntos` WRITE;
/*!40000 ALTER TABLE `puntos` DISABLE KEYS */;
INSERT INTO `puntos` VALUES (1,317,999.00,'1727979678338'),(2,319,999.00,'1727980521199'),(3,317,5000.00,'1728495116703'),(4,322,1000.00,'1728765681438'),(5,321,44.24,'1728766397889');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transacciones`
--

LOCK TABLES `transacciones` WRITE;
/*!40000 ALTER TABLE `transacciones` DISABLE KEYS */;
INSERT INTO `transacciones` VALUES (1,43,317,10000.00,999.00,'1727979678338',NULL),(2,43,319,10000.00,999.00,'1727980521199',NULL),(3,43,317,50000.00,5000.00,'1728495116703',NULL),(4,43,322,10000.00,1000.00,'1728765681438',NULL),(5,45,321,553.00,44.24,'1728766397889',NULL);
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
INSERT INTO `users` VALUES ('0df96ed3-0ffa-4fa2-aef8-1b7a575385b1','maxi@gmail.com','$2b$10$4Gjbnnu6PKObqc3Ff5/TCOseWYP7.xmEHPTmx.UlhwQafEfsYoaqW','comercio'),('1b88918b-4446-4f4e-b7b4-4e744ddcfbce','superadmin@gmail.com','$2b$10$DBMlie2hOBpMNo8qKRr1X.0VxsJhntvbKd.CweFzG1VGC1zTk6WCq','superadmin'),('2f5ab53f-8a6d-4374-8603-804ec104d6e4','evelin@gmail.com','$2b$10$/gnLjCXaeyfhNR4bt8OgeuIc9N0MpAaOHpInN6PzcEvWzv3895FUW','admin'),('3604d157-c647-443e-832c-ec9a5d9612ab','comercio@gmail.com','$2b$10$bM6foc8ptS9uocMGyswss.jI/lSVQqpAow9an1aDGxfqK5Mr9lHp6','comercio'),('44f1e73a-f3a8-42a5-a8bb-76fb07f7e7a8','comercio2@gmail.com','$2b$10$C1vjY7aLX03xdeSN0PS3EePkf.DQV2RUwbLSKUG0QnYKk4gWTENue','comercio'),('465f6cab-a66b-4425-a4ff-c541cf4f01c0','MARIO@GMAIL.COM','$2b$10$4L.mYnGg/VZ4lZ7LgDyh8.w7p9wAQuYO2tL2d3lf8GYXytYVhFKUi','admin'),('47b0b1de-83c4-4692-9434-d25bd5188521','polleria@gmail.com','$2b$10$A0wWvlh4hN1Nd3fMho8mj.yi8SP/276csqQvoAg3jSPzP8yBaOvKy','comercio'),('50b776be-7b8f-4e6a-b17a-78c7b0442f0b','eduardo@gmail.com','$2b$10$Okzi/mxYiW0xWGmEspGTHOcF4eCjmAhiiGmVlIHceMdICJijP34iK','admin'),('61e614e7-8165-44b2-ad2d-98d97c850bc7','admin@gmail.com','$2b$10$5s6lNHyd.2.3iQLknaEy0u/.hukYDuErB904BQe/6p3kXBYdFfr4O','admin'),('875ec67f-b73b-4952-94f3-c70d7b751cf7','admin2@gmail.com','$2b$10$5tL7C/6vKfid1H0QJFZ/sOmPg9R0XRpirEBfo9FQCNQwp82d6G/lS','admin'),('d4841270-b30f-456f-855b-ce94165860a9','winet','$2b$10$0uijNCxHdNMwGWQl4.2ekeKsnJxPo.F7vbJzBtkN6nKaDAp7USrEG','superadmin'),('e447ab4e-79e2-4088-ad8e-cdcbcae9c686','PUENTE@GMAIL.COM','$2b$10$a6ZKAX0hNtGlIOYMNTlc6OP/f2DbefdrIXU3f5wi.4dqSTgkBxXRy','comercio');
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

-- Dump completed on 2024-10-12 18:18:27
