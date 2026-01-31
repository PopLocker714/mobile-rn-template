import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const events = table("events",
    {
        id: t.int().primaryKey({ autoIncrement: true }),
        type: t.text({ enum: ['grow_fuild_item', 'growup_fuild_item'] }).notNull(),
        data: t.text({ mode: "json" }).$type<{ game_item_id: number, fuild_id: number }>().notNull()
    }
);

export type TInsertEvent = typeof events.$inferInsert
