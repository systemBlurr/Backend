CREATE TABLE `user_master` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(500)  NULL,
  `email` VARCHAR(500)  NULL,
  `password` VARCHAR(500)  NULL,
  `mobile` VARCHAR(500)  NULL,
  `profile` VARCHAR(500)  NULl,
   `role_id` INT NOT NULL,
   `dep_id` INT NOT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `created_on` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`));