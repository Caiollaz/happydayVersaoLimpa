CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`site_id` text NOT NULL,
	`plan` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`mp_preference_id` text,
	`mp_payment_id` text,
	`mp_payment_method` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`paid_at` integer,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_mp_payment_id_unique` ON `orders` (`mp_payment_id`);--> statement-breakpoint
CREATE INDEX `orders_site_idx` ON `orders` (`site_id`);--> statement-breakpoint
CREATE TABLE `photos` (
	`id` text PRIMARY KEY NOT NULL,
	`site_id` text NOT NULL,
	`slot` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`path` text NOT NULL,
	`thumb_path` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`bytes` integer NOT NULL,
	`dominant_color` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `photos_site_slot_idx` ON `photos` (`site_id`,`slot`,`order`);--> statement-breakpoint
CREATE TABLE `sites` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text,
	`edit_token` text NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`owner_email` text,
	`config` text NOT NULL,
	`plan` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`published_at` integer,
	`expires_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sites_slug_unique` ON `sites` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `sites_edit_token_unique` ON `sites` (`edit_token`);--> statement-breakpoint
CREATE INDEX `sites_status_idx` ON `sites` (`status`);--> statement-breakpoint
CREATE INDEX `sites_updated_idx` ON `sites` (`updated_at`);