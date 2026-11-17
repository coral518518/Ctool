<template>
    <div class="relative inline-flex items-center">
        <Input
            size="small"
            :width="160"
            :placeholder="$t('main_search_placeholder')"
            v-model="input"
            @load="load"
            @keyup.enter="keyupEnter"
            @keyup.up="keyupUp"
            @keyup.down="keyupDown"
            @keyup.esc="close"
        >
            <template #suffix>
                <Search :size="13" class="text-muted-foreground" />
            </template>
        </Input>

        <Teleport to="#ctool-append">
            <div
                v-if="isInput"
                ref="container"
                class="ctool-search-block fixed z-[9999] w-[260px] max-h-72 overflow-y-auto rounded-lg border border-border bg-popover/95 backdrop-blur-md p-1.5 shadow-2xl text-popover-foreground transition-all duration-150"
                :style="searchPositionStyle"
            >
                <div class="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground select-none">
                    {{ input ? $t('main_search_placeholder') : $t('main_recently_use') }}
                </div>
                <div
                    v-for="(item, index) in items"
                    :key="`${item.tool}-${item.feature}`"
                    :class="[
                        'flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer select-none transition-colors',
                        index === selectIndex ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-accent hover:text-accent-foreground text-foreground'
                    ]"
                    @click="select(index)"
                    @mouseover="selectIndex = index"
                >
                    <span class="truncate">{{ item.label }}</span>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { toolKeywords } from "@/buildDataTemp";
import { getTool, FeatureInterface } from "@/config";
import useOperate from "@/store/operate";
import useSetting from "@/store/setting";
import { watch, ref, computed } from "vue";
import { Search } from "lucide-vue-next";

const setting = useSetting();
const operate = useOperate();
let container = $ref<HTMLElement | null>(null);
let input = $ref("");
let inputElement = $ref<HTMLInputElement | null>(null);
let isInput = $ref(false);
let selectIndex = $ref(0);
const searchCoords = ref({ top: 38, left: 100 });

const searchPositionStyle = computed(() => {
    return {
        top: `${searchCoords.value.top}px`,
        right: `12px`,
    };
});

const items = $computed(() => {
    let lists: FeatureInterface[];
    if (input === "") {
        lists = [
            ...new Set([
                ...operate.getRecently(),
                ...setting.items.common.map(name => {
                    return getTool(name).firstFeature();
                }),
            ]),
        ];
    } else {
        lists = toolKeywords
            .filter(item => item.search.join(",").includes(input.toLowerCase()))
            .map(item => {
                return getTool(item.name).getFeature(item.feature);
            });
    }
    if (lists.length === 0) {
        return [{ label: $t("main_ui_null"), tool: "", feature: "" }];
    }
    return lists.slice(0, 15).map(feature => {
        const tool = feature.tool;
        return {
            label: `${$t(`tool_${tool.name}`)}${tool.isSimple() ? "" : ` - ${$t(`tool_${tool.name}_${feature.name}`)}`}`,
            tool: tool.name,
            feature: feature.name,
        };
    });
});

const updatePosition = () => {
    if (inputElement) {
        const rect = inputElement.getBoundingClientRect();
        searchCoords.value = {
            top: rect.bottom + 6,
            left: Math.max(10, rect.left - 40),
        };
    }
};

const open = () => {
    updatePosition();
    isInput = true;
    selectIndex = 0;
};

const close = () => {
    input = "";
    isInput = false;
    selectIndex = 0;
};

const load = (element: HTMLInputElement) => {
    inputElement = element;
    element.addEventListener("focus", () => open());
    document.addEventListener("click", (e: MouseEvent) => {
        if (element.contains(e.target as any) || container?.contains(e.target as any)) {
            return;
        }
        close();
    });
};

const select = (index: number) => {
    if (items.length === 0 || items.length - 1 < index) {
        return;
    }
    const { tool, feature } = items[index];
    const keyword = input;
    if (tool !== "") {
        operate.redirectTool(tool, feature, "", "", keyword);
    }
    inputElement?.blur();
    close();
};

const keyupEnter = () => {
    select(selectIndex);
};

const keyupUp = () => {
    if (items.length === 0) {
        return;
    }
    selectIndex = selectIndex === 0 ? items.length - 1 : selectIndex - 1;
};

const keyupDown = () => {
    if (items.length === 0) {
        return;
    }
    selectIndex = selectIndex === items.length - 1 ? 0 : selectIndex + 1;
};

watch(
    () => input,
    () => (selectIndex = 0),
    { immediate: true },
);
</script>
