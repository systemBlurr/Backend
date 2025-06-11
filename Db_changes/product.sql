CREATE TABLE `product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(500)  NULL,
  `p_code` VARCHAR(500)  NULL,
  `description` VARCHAR(500)  NULL,
  `qty` VARCHAR(500)  NULL,
  `price` VARCHAR(500)  NULL,
  `unit` VARCHAR(500)  NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `created_on` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`));