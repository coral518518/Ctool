import prettier from "prettier/standalone";
import html from "prettier/plugins/html";
import Base from "./base";

export const formatter = new (class extends Base<'html'> {
    async beautify(): Promise<string> {
        return prettier.format(this.code, {
            plugins: [html],
            parser: "html",
            tabWidth: this.getOptionValue('tab', 4)
        });
    }

    async compress(): Promise<string> {
        return this.code
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/>\s+</g, "><")
            .trim();
    }
})

