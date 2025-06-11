CREATE TABLE `purchase` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `s_id` INT NULL,
  `p_id` INT NULL,
  `description` VARCHAR(1000)  NULL,
  `p_order` VARCHAR(1000)  NULL,
  `price` VARCHAR(500)  NULL,
  `qty` VARCHAR(500)  NULL,
  `unit` VARCHAR(500)  NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `p_date` DATE NULL,
  `created_on` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`s_id`) REFERENCES `supplier` (`id`),
  FOREIGN KEY (`p_id`) REFERENCES `product` (`id`)
);
