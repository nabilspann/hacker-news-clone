import {
  pgTable, uuid, timestamp, integer, text, boolean
} from "drizzle-orm/pg-core";

export const usersTableName = 'profiles'
export const users = pgTable(usersTableName, {
  user_id: uuid("user_id").primaryKey().defaultRandom().notNull(),
  username: text("username").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  is_sign_up: boolean("is_sign_up").notNull().default(false),
});

export const postsTableName = 'posts'
export const posts = pgTable(postsTableName, {
  post_id: uuid("post_id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.user_id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  num_of_children: integer("num_of_children").notNull().default(0),
});

export const commentsTableName = 'comments'
export const comments = pgTable(commentsTableName, {
  comment_id: uuid("comment_id").primaryKey().defaultRandom(),
  comment_num: integer("comment_num").notNull(),
  level: integer("level").notNull(),
  parent_id: uuid("parent_id"),
  user_id: uuid("user_id").references(() => users.user_id).notNull(),
  post_id: uuid("post_id")
    .references(() => posts.post_id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  body: text("body").notNull(),
  likes: integer("likes").default(0).notNull(),
  dislikes: integer("dislikes").default(0).notNull(),
  is_deleted: boolean("is_deleted").notNull().default(false),
  num_of_children: integer("num_of_children").notNull().default(0),
});
