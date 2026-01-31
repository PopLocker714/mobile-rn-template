import { Storage } from '@op-engineering/op-sqlite'
import { setPersistentEngine, type PersistentListener, type PersistentEvent } from '@nanostores/persistent'

const db = new Storage({
    location: 'persist'
})

let listeners: PersistentListener[] = []

function emit(key: string, newValue: string) {
    const event: PersistentEvent = {
        key,
        newValue
    }

    for (const cb of listeners) {
        cb(event)
    }
}



const storage = new Proxy<Record<string, any>>(
    {},
    {
        get(_, key: string) {
            if (typeof key !== 'string') return undefined
            return db.getItemSync(key) ?? ''
        },

        set(_, key: string, value: string) {
            if (typeof key !== 'string') return true

            db.setItemSync(key, value)
            emit(key, value)
            return true
        },

        deleteProperty(_, key: string) {
            if (typeof key !== 'string') return true

            db.removeItemSync(key)
            emit(key, '')
            return true
        },

        has(_, key: string) {
            if (typeof key !== 'string') return false
            return db.getItemSync(key) !== null
        },

        ownKeys() {
            return db.getAllKeys()
        },

        getOwnPropertyDescriptor() {
            return {
                enumerable: true,
                configurable: true
            }
        }
    }
)


const events = {
    addEventListener(_key: string, callback: PersistentListener) {
        listeners.push(callback)
    },

    removeEventListener(_key: string, callback: PersistentListener) {
        listeners = listeners.filter(i => i !== callback)
    },

    perKey: false
}

setPersistentEngine(storage, events)
