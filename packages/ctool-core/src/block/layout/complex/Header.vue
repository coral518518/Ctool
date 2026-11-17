<template>
    <header class="ctool-header flex flex-col border-b border-border/80 bg-card/60 backdrop-blur-sm select-none shrink-0 z-20">
        <!-- Top Row: Github + Categories + Search & Tools -->
        <div class="ctool-header-top h-[38px] px-3 border-b border-border/60 flex items-center justify-between gap-2 overflow-hidden">
            <div class="flex items-center gap-2.5 overflow-hidden">
                <Github />
                <div class="h-3.5 w-[1px] bg-border/80 shrink-0" />
                <div class="ctool-header-top-left flex items-center gap-1 overflow-x-auto py-1">
                    <button
                        v-for="name in allCategories"
                        :key="name"
                        type="button"
                        @click="selectCategory(name)"
                        :class="[
                            'px-2.5 py-1 text-xs rounded-md transition-all duration-150 whitespace-nowrap cursor-pointer select-none',
                            selectedCategory === name
                                ? 'bg-primary/15 text-primary font-semibold border border-primary/25 shadow-xs'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                        ]"
                    >
                        {{ $t(`main_category_${name}`) }}
                    </button>
                </div>
            </div>

            <div class="ctool-header-top-right flex items-center gap-2 shrink-0">
                <Search />
                <button
                    type="button"
                    @click="openTools = !openTools"
                    class="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-95 cursor-pointer"
                    :title="$t('main_tools_lists')"
                >
                    <Icon :size="16" name="common" />
                </button>
            </div>
        </div>

        <!-- Middle Row: Tools in Selected Category -->
        <div class="ctool-header-middle flex flex-wrap gap-1.5 px-3 py-2 border-b border-border/40 bg-muted/20">
            <button
                v-for="name in categoryTools"
                :key="name"
                type="button"
                @click="selectTool(name)"
                :class="[
                    'inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md border transition-all duration-150 cursor-pointer select-none',
                    storeOperate.items.tool === name
                        ? 'bg-primary/10 border-primary/40 text-primary font-semibold shadow-xs'
                        : 'border-border/60 bg-card hover:bg-accent/60 text-muted-foreground hover:text-foreground hover:border-border'
                ]"
            >
                <span class="w-1.5 h-1.5 rounded-full" :class="storeOperate.items.tool === name ? 'bg-primary' : 'bg-muted-foreground/30'" />
                <span>{{ $t(`tool_${name}`) }}</span>
            </button>
        </div>

        <!-- Bottom Row: Sub-features Tabs (if applicable) -->
        <div class="ctool-header-bottom flex items-center justify-center h-[30px] px-3 bg-muted/40 gap-1 overflow-x-auto" v-if="features.length > 1">
            <button
                v-for="feature in features"
                :key="`${storeOperate.items.tool}-${feature.name}`"
                @click="selectFeature(feature)"
                type="button"
                :class="[
                    'px-3 py-0.5 text-xs rounded-md transition-all duration-150 whitespace-nowrap cursor-pointer select-none',
                    storeOperate.items.feature === feature.name
                        ? 'bg-background text-primary font-semibold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                ]"
            >
                {{ $t(`tool_${storeOperate.items.tool}_${feature.name}`) }}
            </button>
        </div>
    </header>

    <ExtendPage v-model="openTools">
        <Tools />
    </ExtendPage>
</template>

<script setup lang="ts">
import useOperate from "@/store/operate";
import useSetting from "@/store/setting";
import { getTool, toolExists, FeatureInterface, categories, getCategory, categoryExists } from "@/config";
import Search from "../../Search.vue";
import Tools from "../../Tools.vue";
import { nextTick, watch } from "vue";
import Github from "../../Github.vue";

const storeOperate = useOperate();
const storeSetting = useSetting();

let openTools = $ref(false);
let selectedCategory = $ref(storeOperate.items.category || "common");

const allCategories = ["common", ...categories.map(({ name }) => name)];
const categoryTools = $computed(() => {
    if (categoryExists(selectedCategory)) {
        return getCategory(selectedCategory).tools.map(({ name }) => name);
    }
    return storeSetting.items.common;
});

const selectCategory = (name: string) => {
    selectedCategory = name;
    let tool = "";
    if (categoryExists(name)) {
        tool = storeOperate.getCategoryLastTool(name);
    } else {
        for (let feature of storeOperate.getRecently()) {
            if (storeSetting.items.common.includes(feature.tool.name)) {
                tool = feature.tool.name;
                break;
            }
        }
    }
    selectTool(tool || categoryTools[0]);
};

const selectTool = (name: string) => {
    storeOperate.redirectTool(name, storeOperate.getToolLastFeature(name), selectedCategory);
};

const features = $computed(() => {
    return toolExists(storeOperate.items.tool) && !getTool(storeOperate.items.tool).isSimple()
        ? getTool(storeOperate.items.tool).features
        : [];
});

const selectFeature = (feature: FeatureInterface) => {
    storeOperate.redirectTool(storeOperate.items.tool, feature.name, storeOperate.items.category);
};

watch(
    () => {
        return {
            tool: storeOperate.items.tool,
            category: storeOperate.items.category,
        };
    },
    ({ tool, category }) => {
        if (!categoryTools.includes(tool as any)) {
            selectedCategory = category;
        }
    },
);

watch(
    () => {
        return {
            selectedCategory,
            tool: storeOperate.items.tool,
        };
    },
    async () => {
        await nextTick();
        window.dispatchEvent(new Event("resize"));
    },
    { immediate: true },
);
</script>
