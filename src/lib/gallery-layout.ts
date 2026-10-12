import { z } from "zod";

export const LAYOUTS = ["grid", "masonry", "column"] as const;
export const layoutSchema = z.enum(LAYOUTS);
export type Layout = z.infer<typeof layoutSchema>;

export const SPANS = ["normal", "wide", "full"] as const;
export const spanSchema = z.enum(SPANS);
export type Span = z.infer<typeof spanSchema>;
