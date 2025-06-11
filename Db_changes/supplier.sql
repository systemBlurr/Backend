CREATE TABLE `supplier` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(500)  NULL,
  `vendor_code` VARCHAR(500)  NULL,
  `address` VARCHAR(500)  NULL,
  `location` VARCHAR(500)  NULL,
  `contact` VARCHAR(500)  NULL,
  `gstin` VARCHAR(500)  NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `created_on` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`));