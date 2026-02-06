import { atom, type StoreValue } from "nanostores";
import type { TInsertEvent } from "../database/schema";

export const $SEvents = atom<TInsertEvent[]>([]);
export type SEventsValue = StoreValue<typeof $SEvents>; //=> LoadingStateValue

export function addEvent(event: TInsertEvent) {
	$SEvents.set([...$SEvents.get(), event]);
}
