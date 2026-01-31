import { persistentAtom } from '@nanostores/persistent'
import { StoreValue } from 'nanostores'

type Product = {
    id: number
    name: string
}

// export const $cart = persistentAtom<Product[]>('cart', [])
export const $Theme = persistentAtom<'dark' | 'light' | 'auto'>('theme', 'auto')
export type SThemeValue = StoreValue<typeof $Theme> //=> LoadingStateValue

// $cart.set([...$cart.get(), newProduct])
// $theme.set('dark')
