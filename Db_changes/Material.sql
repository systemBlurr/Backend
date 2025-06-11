CREATE TABLE `materials` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `materials` VARCHAR(1000) NULL,
  `mqty` VARCHAR(500) NULL,
  `mPrice` VARCHAR(500) NULL,
  `rqty` VARCHAR(500) NULL,
  `rPrice` VARCHAR(500) NULL,
  `lqty` VARCHAR(500) NULL,
  `lPrice` VARCHAR(500) NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `created_on` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`)
);
