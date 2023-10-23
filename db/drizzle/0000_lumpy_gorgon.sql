CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`full_name` text(256) DEFAULT '' NOT NULL,
	`last_name` text(256) DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `name_idx` ON `users` (`full_name`);