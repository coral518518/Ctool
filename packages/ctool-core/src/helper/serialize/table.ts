import {unescape, isArray, isPlainObject} from "lodash";

const parseHtmlTable = (html: string): HTMLTableElement | null => {
    try {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.querySelector("table");
    } catch {
        return null;
    }
};

const nodeFilter = (item: string): string => {
    if (item === null) {
        return "";
    }
    const re = new RegExp("</?\\w+((\\s+\\w+(\\s*=\\s*(?:\".*?\"|'.*?'|[^'\">\\s]+))?)+\\s*|\\s*)/?>", 'igm');
    item = item.replace(/\r\n|\r|\n/gmi, ' ');
    item = item.replace(/\n|<br>|<br\/>|<br \/>/gmi, '\n');
    item = item.replace(re, '');
    item = unescape(item);
    item = item.replace(/&nbsp;/gmi, " ");
    return item.trim();
}

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


export const tableKeys = (table: string) => {
    table = table.trim();
    if (!table) {
        return [];
    }
    const tableElement = parseHtmlTable(table);
    if (!tableElement) {
        return [];
    }
    const firstRow = tableElement.querySelector("tr");
    if (!firstRow) {
        return [];
    }
    const cells = firstRow.querySelectorAll("td,th");
    let result: string[] = [];
    for (let n = 0; n < cells.length; n++) {
        result.push(nodeFilter(cells[n].innerHTML))
    }
    return result;
}

export const parse = (table = "", {
    keyed_key = 0,
    type = "row_object"
} = {}) => {
    table = table.trim();
    if (!table) {
        return "";
    }
    const tableElement = parseHtmlTable(table);
    if (!tableElement) {
        return "";
    }
    const firstRow = tableElement.querySelector("tr");
    if (!firstRow) {
        return "";
    }
    const cells = firstRow.querySelectorAll("td,th");
    let keys: string[] = [];
    for (let n = 0; n < cells.length; n++) {
        keys.push(nodeFilter(cells[n].innerHTML));
    }
    const rows = tableElement.getElementsByTagName('tr');
    let result: any[] = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].querySelectorAll('td');
        let resultRow = {}
        for (let k = 0; k < keys.length; k++) {
            resultRow[keys[k]] = nodeFilter(k in row ? row[k].innerHTML : "")
        }
        result.push(resultRow)
    }
    return jsonOutputFormat(
        result,
        type,
        keyed_key
    )
}

const escapeHtml = (val: any): string => {
    if (val === null || val === undefined) return '';
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const stringify = (json: any, {header = true} = {}) => {
    if (json === null || json === undefined) {
        return "";
    }
    if (isPlainObject(json)) {
        const keys = Object.keys(json);
        if (keys.length === 0) {
            return "";
        }
        if (keys.length === 1 && isArray(json[keys[0]])) {
            return stringify(json[keys[0]], { header });
        }
        return stringify([json], { header });
    }
    if (!isArray(json) || json.length < 1) {
        return "";
    }

    if (isArray(json[0])) {
        let html = ["<table><tbody>"];
        for (const row of json) {
            html.push("<tr>", ...row.map(cell => `<td>${escapeHtml(cell)}</td>`), "</tr>");
        }
        html.push("</tbody></table>");
        return html.join("");
    }

    let records = json;
    let keys: string[] = [];

    if (isPlainObject(json[0])) {
        keys = Array.from(new Set(json.flatMap(item => isPlainObject(item) ? Object.keys(item) : [])));
    } else {
        records = json.map(v => ({ value: v }));
        keys = ["value"];
    }

    let html = ["<table>"];
    if (header) {
        html.push(
            '<thead>',
            '<tr>',
            ...keys.map((item) => {
                return `<th>${escapeHtml(item)}</th>`
            }),
            '</tr>',
            '</thead>'
        )
    }
    html.push("<tbody>")
    for (let row of records) {
        html.push("<tr>", ...keys.map((item) => {
            return `<td>${item in row ? escapeHtml(row[item]) : ""}</td>`
        }), '</tr>');
    }
    html.push("</tbody></table>")
    return html.join("")
}

export default {
    parse, stringify
}
