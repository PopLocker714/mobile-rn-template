import { persistentAtom } from "@nanostores/persistent";
import type { StoreValue } from "nanostores";

export const $Theme = persistentAtom<"dark" | "light" | "auto">("theme", "auto");
export type SThemeValue = StoreValue<typeof $Theme>; //=> LoadingStateValue
