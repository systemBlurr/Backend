CREATE TABLE `production` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `c_id` INT NULL,
  `p_id` INT NULL,
  `p_desc` VARCHAR(1000) NULL,
  `qty` VARCHAR(500) NULL,
  `unit` VARCHAR(500) NULL,
  `operatorName` VARCHAR(500) NULL,
  `comment` VARCHAR(1000) NULL,
  `m_date` TIMESTAMP  NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `created_on` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`c_id`) REFERENCES `customer` (`id`),
  FOREIGN KEY (`p_id`) REFERENCES `product` (`id`)
);
