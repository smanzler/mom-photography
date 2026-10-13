import { customType } from "drizzle-orm/pg-core";

// Fractional-index keys compare by byte; the default locale collation puts them in the wrong order.
export const position = customType<{ data: string }>({
  dataType: () => 'text COLLATE "C"',
});
