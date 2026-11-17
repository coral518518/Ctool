import {parse as csvParse} from 'csv-parse/sync';
import {stringify as csvStringify} from 'csv-stringify/sync';
import {isArray, isPlainObject} from "lodash";

const jsonOutputFormat = (json, type = "json", keyed_key = 0) => {
    if (!isArray(json) || json.length === 0) {
        return json;
    }
    if (type === "keyed") {
        const keys = Object.keys(json[0] || {})
        let result = {}
        for (let item of json) {
            let item_key = keys[keyed_key]
            result[item[item_key]] = item
        }
        return result
    }
    if (type === "row_array") {
        let result = json.map((item) => {
            return Object.values(item)
        })
        if (result.length > 0) {
            result = [
                Object.keys(json[0] || {}),
                ...result
            ]
        }
        return result
    }
    if (type === "column_array") {
        const keys = Object.keys(json[0] || {})
        let result = {}
        for (let key of keys) {
            result[key] = json.map((item) => {
                return item[key]
            })
        }
        return result
    }
    return json
}

export const getKeyedField = (csv: string) => {
    try {
        const parsed = csvParse(csv || "", {columns: true, skip_empty_lines: true});
        return Object.keys(parsed[0] || {});
    } catch {
        return [];
    }
}

export const parse = (csv = "", {type = "row_object", keyed_key = 0} = {}) => {
    csv = (csv || "").trim();
    if (!csv) {
        return [];
    }
    return jsonOutputFormat(
        csvParse(csv, {columns: true, skip_empty_lines: true}),
        type,
        keyed_key
    )
}

const stringify = (json: any, {quoted = false, header = true} = {}) => {
    if (json === null || json === undefined) {
        return "";
    }
    if (isPlainObject(json)) {
        const keys = Object.keys(json);
        if (keys.length === 0) {
            return "";
        }
        // 若顶层为单 key 包装数组（如 { data: [...] }），解包后转换
        if (keys.length === 1 && isArray(json[keys[0]])) {
            return stringify(json[keys[0]], {quoted, header});
        }
        return csvStringify([json], {quoted, header, columns: keys});
    }
    if (isArray(json)) {
        if (json.length === 0) {
            return "";
        }
        if (isArray(json[0])) {
            return csvStringify(json, {quoted, header: false});
        }
        if (isPlainObject(json[0])) {
            const columns = Array.from(new Set(json.flatMap(item => isPlainObject(item) ? Object.keys(item) : [])));
            return csvStringify(json, {quoted, header, columns});
        }
        // 简单原生类型数组（字符串、数字等）
        if (header) {
            return csvStringify(json.map(v => ({ value: v })), {quoted, header: true, columns: ['value']});
        }
        return csvStringify(json.map(v => [v]), {quoted, header: false});
    }
    return csvStringify([[json]], {quoted, header: false});
}

export default {
    parse,
    stringify
}

