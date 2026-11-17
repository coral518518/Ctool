import formatter from "@/tools/code/formatter";
import unicode from "@/tools/unicode/util";
import {isPlainObject, isArray} from "lodash";
import jsonKeysSort from "json-keys-sort";
import {TypeLists as RenameType, convent as nameConvent} from "@/helper/nameConvert";

const beautify = async (code: string, {tab = 4}: any = {}) => {
    return code !== "" ? await (await formatter.load('json')).set(code, {tab}).format('beautify') : ""
}
const compress = async (code: string) => {
    return code !== "" ? await (await formatter.load('json')).set(code).format('compress') : ""
}
const rename = (code: any, type: RenameType): any => {
    if (isArray(code)) {
        return code.map(item => rename(item, type));
    }
    if (isPlainObject(code)) {
        const result: Record<string, any> = {};
        for (const key of Object.keys(code)) {
            const newKey = nameConvent(key, type);
            if (newKey === '__proto__' || newKey === 'constructor' || newKey === 'prototype') {
                continue;
            }
            result[newKey] = rename(code[key], type);
        }
        return result;
    }
    return code;
}

// unicode2zh
const unicode2zh = (content: string) => {
    return unicode.decode(
        content.replace(/\\U[0-9a-fA-F]{4}/g, (item) => {
            // \Uxxxx=>\uxxxx
            return item.replace("\\U", "\\u");
        })
    )
}

// zh2unicode
const zh2unicode = (content: string) => {
    if (content !== "") {
        let newStr = ''
        for (let i = 0; i < content.length; i++) {
            let str = content.charAt(i)
            newStr += /[\u4e00-\u9fa5]/.test(str) ? '\\u' + str.charCodeAt(0).toString(16) : str
        }
        return newStr
    }
    return content
}

export default {
    beautify,
    compress,
    rename,
    unicode2zh,
    zh2unicode,
    sortAsc(data: object) {
        return jsonKeysSort.sort(data)
    },
    sortDesc(data: object) {
        return jsonKeysSort.sort(data, false)
    },
    escape(content: string) {
        return content.trim().replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    },
    clearEscape(content: string) {
        return content.trim().replace(/\\\\/g, '\\').replace(/\\"/g, '"')
    },
}
