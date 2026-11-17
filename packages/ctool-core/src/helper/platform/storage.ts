import store from 'store2'
import {StorageInterface, StorageDataStructure, StorageDataStructureInterface} from '@/types'

// 当前操作实例
const instance = store.namespace('ctool')

class storage implements StorageInterface {
    get<T>(key: string): StorageDataStructure<T> {
        try {
            return instance.get(key, null)
        } catch {
            return null
        }
    }

    clear(): void {
        try {
            instance.clear()
        } catch {}
    }

    getAllKey(): string[] {
        try {
            return instance.keys();
        } catch {
            return []
        }
    }

    remove(key: string): void {
        try {
            instance.remove(key)
        } catch {}
    }

    set<T>(key: string, value: StorageDataStructureInterface<T>): void {
        try {
            instance.set(key, value)
        } catch (e) {
            console.warn("Storage set failed (storage quota may be exceeded):", e)
        }
    }
}

export default new storage()
