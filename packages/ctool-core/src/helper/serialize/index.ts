import qs from "qs";
import csv from "./csv";
import table from "./table";
import { fromString as readerPhpArray } from "php-array-reader";
import propertiesToJSON from "./propertiesToJson";
import jsonToPropertiesParser from "json-to-properties/src/scripts/parser";
import yaml from "./yaml";
import phpArray from "./phpArray";
import toml from "@ltd/j-toml";
import xml from "./xml";
import phpSerialize from "./phpSerialize";
import { isEmpty, isObject, isArray, isPlainObject } from "lodash";
import Json from "@/helper/json";

type  ContentType = any[] | { [key: string]: any } | [] | {}

type Option = Record<string, any>

class Serialize<T extends ContentType = ContentType> {
    _content: T;
    _error: string | null;

    private constructor(
        _content: T,
        _error: string | null = null,
    ) {
        this._content = _content;
        this._error = _error;
    }

    static formCallback<T extends ContentType = ContentType>(callback: () => T, error: string = "") {
        try {
            if (error !== "") {
                return Serialize.fromError(error);
            }
            const result = callback();
            if (!isObject(result)) {
                throw new Error("input parse fail");
            }
            return new Serialize<T>(result);
        } catch (e) {
            console.error(e);
            return Serialize.fromError($error(e));
        }
    }

    static fromError(str: string) {
        return new Serialize({}, str);
    }

    static empty() {
        return new Serialize({});
    }

    static formObject(value: Object) {
        return Serialize.formCallback(() => {
            return value;
        });
    }

    static formJson<T extends ContentType = ContentType>(str: string) {
        return Serialize.formCallback<T>(() => {
            return Json.parse(str, { JSON_REPAIR: true });
        });
    }

    static formQueryString<T extends ContentType = ContentType>(str: string) {
        return Serialize.formCallback<T>(() => {
            return qs.parse(str) as T;
        });
    }

    static formCsv<T extends ContentType = ContentType>(str: string, {
        type = "row_object",
        keyed_key = 0,
    }: Option = {}) {
        return Serialize.formCallback<T>(() => {
            return csv.parse(str, { type, keyed_key });
        });
    }

    static formTable<T extends ContentType = ContentType>(str: string, {
        type = "row_object",
        keyed_key = 0,
    }: Option = {}) {
        return Serialize.formCallback<T>(() => {
            return table.parse(str, { type, keyed_key });
        });
    }

    static formXml<T extends ContentType = ContentType>(str: string, { attribute_prefix = "" }: Option = {}) {
        return Serialize.formCallback<T>(() => {
            return xml.parse(str, { attribute_prefix });
        });
    }

    static formYaml<T extends ContentType = ContentType>(str: string) {
        return Serialize.formCallback<T>(() => {
            return yaml.load(str) as T;
        });
    }

    static formPhpArray<T extends ContentType = ContentType>(str: string) {
        return Serialize.formCallback<T>(() => readerPhpArray(str));
    }

    static formPhpSerialize<T extends ContentType = ContentType>(str: string) {
        return Serialize.formCallback<T>(() => {
            return phpSerialize.parse<T>(str);
        });
    }

    static formToml<T extends ContentType = ContentType>(str: string) {
        return Serialize.formCallback<T>(() => {
            return toml.parse(str) as T;
        });
    }

    static formProperties<T extends ContentType = ContentType>(str: string, { convertToJsonTree = false }: Option = {}) {
        return Serialize.formCallback<T>(() => {
            return propertiesToJSON(str, { convertToJsonTree });
        });
    }

    toJson() {
        return Json.stringify(this.content());
    }

    toQueryString() {
        return qs.stringify(this.content());
    }

    toCsv({ quoted = false, header = true }: Option = {}) {
        return csv.stringify(this.content(), { quoted, header });
    }

    toText({ delimiter = ",\\n", is_add_quote = false }: Option = {}) {
        if (this.isEmpty()) {
            return "";
        }
        const content = this.content();
        const delim = (delimiter || ",\\n").replace(/\\n/g, "\n");
        const formatVal = (v: any) => {
            const str = typeof v === "object" && v !== null ? Json.stringify(v) : String(v);
            return is_add_quote ? `"${str}"` : str;
        };

        if (isArray(content)) {
            return content.map(item => formatVal(item)).join(delim);
        }
        if (isPlainObject(content)) {
            const keys = Object.keys(content);
            if (keys.length === 1 && isArray(content[keys[0]])) {
                return content[keys[0]].map(item => formatVal(item)).join(delim);
            }
            return keys.map(k => {
                const val = content[k];
                const str = typeof val === "object" && val !== null ? Json.stringify(val) : String(val);
                return is_add_quote ? `"${k}": "${str}"` : `${k}: ${str}`;
            }).join(delim);
        }
        return formatVal(content);
    }

    toTable({ header = true }: Option = {}) {
        return table.stringify(this.content(), { header });
    }

    toXml({ attribute_prefix = "" }: Option = {}) {
        return xml.stringify(this.content(), { attribute_prefix });
    }

    toYaml() {
        return yaml.dump(this.content());
    }

    toPhpSerialize() {
        return phpSerialize.stringify(this.content());
    }

    toPhpArray() {
        return phpArray.stringify(this.content());
    }

    toToml() {
        const content = this.content();
        const data = isArray(content) ? { items: content } : content;
        const res = toml.stringify(data as any, { newline: "\n", integer: Number.MAX_SAFE_INTEGER });
        return (Array.isArray(res) ? res.join("\n") : String(res)).trim();
    }

    toProperties() {
        return jsonToPropertiesParser.deflate(this.content()).join("\n") as string;
    }

    content() {
        return this._content;
    }

    isError() {
        return this._error !== null;
    }

    error() {
        return this._error || "";
    }

    isEmpty() {
        return isEmpty(this.content());
    }
}

export default Serialize;
