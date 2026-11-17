<template>
    <div class="ctool-table w-full overflow-auto rounded-md border border-border/70 bg-card text-xs shadow-xs" :style="style">
        <table role="grid" class="w-full caption-bottom text-xs border-collapse">
            <thead>
                <tr class="border-b border-border/70 bg-muted/40 transition-colors">
                    <th
                        v-for="column in columns"
                        :key="column.key || column.title"
                        :style="{ ...(column.width ? { width: sizeConvert(column.width) } : {}) }"
                        class="h-8 px-3 text-left align-middle font-semibold text-muted-foreground sticky top-0 bg-muted/50 z-10 select-none whitespace-nowrap"
                    >
                        {{ column.title }}
                    </th>
                    <template v-if="$slots.default">
                        <th
                            :style="{ ...(actionWidth ? { width: sizeConvert(actionWidth) } : {}) }"
                            class="h-8 px-3 text-center align-middle font-semibold text-muted-foreground sticky top-0 bg-muted/50 z-10 select-none whitespace-nowrap"
                        >
                            {{ $t('main_ui_op') }}
                        </th>
                    </template>
                </tr>
            </thead>
            <tbody class="[&_tr:last-child]:border-0 divide-y divide-border/40">
                <tr
                    v-for="(items, index) in lists"
                    :key="index"
                    class="border-b border-border/40 transition-colors hover:bg-muted/30"
                >
                    <template v-if="$slots.column">
                        <slot :row="items" :index="index" name="column" />
                    </template>
                    <template v-else v-for="column in columns" :key="column.key">
                        <td v-if="column.html" v-html="items[column.key]" class="p-2.5 align-middle" />
                        <td v-else class="p-2.5 align-middle">{{ items[column.key] }}</td>
                    </template>
                    <template v-if="$slots.default">
                        <td class="p-2.5 align-middle text-center">
                            <slot :row="items" :index="index" />
                        </td>
                    </template>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { TableConfig, TableLists } from "@/types";
import { PropType, StyleValue } from "vue";
import { sizeConvert } from "@/components/util";

const props = defineProps({
    columns: {
        type: Array as PropType<TableConfig>,
        default: () => [],
    },
    lists: {
        type: Array as PropType<TableLists>,
        default: () => [],
    },
    height: {
        type: [String, Number],
        default: "",
    },
    actionWidth: {
        type: [String, Number],
        default: "",
    },
    border: {
        type: Boolean,
        default: false,
    },
});

const style = $computed(() => {
    let css: StyleValue = {};
    if (props.height) {
        css.height = sizeConvert(props.height);
    }
    return css;
});
</script>
