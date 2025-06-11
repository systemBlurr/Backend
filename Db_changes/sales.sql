CREATE TABLE `sales` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `c_id` INT NULL,
  `p_id` INT NULL,
  `p_desc` VARCHAR(1000)  NULL,
  `qty` VARCHAR(500)  NULL,
  `s_price` VARCHAR(500)  NULL,
  `unit` VARCHAR(500)  NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `s_date` DATE  NULL,
  `created_on` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`c_id`) REFERENCES `customer` (`id`),
  FOREIGN KEY (`p_id`) REFERENCES `product` (`id`)
);
