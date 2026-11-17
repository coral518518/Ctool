import prettier from "prettier/standalone";
import css from "prettier/plugins/postcss";
import Base from "./base";

export const formatter = new (class extends Base<'css'> {
    async beautify(): Promise<string> {
        return prettier.format(this.code, {
            plugins: [css],
            parser: "css",
            tabWidth: this.getOptionValue('tab', 4)
        });
    }

    async compress(): Promise<string> {
        return this.code
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/\s*([{}:;,])\s*/g, "$1")
            .replace(/\s+/g, " ")
            .trim();
    }
})

