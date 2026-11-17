<template>
    <header class="ctool-header h-[38px] px-3 border-b border-border/80 bg-card/60 backdrop-blur-sm flex items-center justify-between select-none shrink-0 z-20">
        <!-- Left Title & Brand -->
        <div class="flex items-center gap-2.5 shrink-0">
            <Github />
            <div class="h-3.5 w-[1px] bg-border/80" />
            <span class="text-xs font-bold text-foreground tracking-tight">
                {{ $t(`tool_${storeOperate.items.tool}`) }}
            </span>
        </div>

        <!-- Center Feature Segmented Tabs -->
        <div class="flex items-center justify-center flex-1 px-2 overflow-hidden" v-if="features.length > 1">
            <div class="inline-flex items-center p-0.5 rounded-lg bg-muted/60 border border-border/50 gap-0.5 max-w-full overflow-x-auto">
                <button
                    v-for="feature in features"
                    :key="`${storeOperate.items.tool}-${feature.name}`"
                    @click="selectFeature(feature)"
                    type="button"
                    :class="[
                        'px-2.5 py-0.5 text-xs font-medium rounded-md transition-all duration-150 whitespace-nowrap cursor-pointer',
                        storeOperate.items.feature === feature.name
                            ? 'bg-background text-primary font-semibold shadow-xs'
                            : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                    ]"
                >
                    {{ $t(`tool_${storeOperate.items.tool}_${feature.name}`) }}
                </button>
            </div>
        </div>
        <div v-else class="flex-1" />

        <!-- Right Action Toolbar -->
        <div class="flex items-center gap-1.5 shrink-0">
            <Search />

            <div class="flex items-center gap-0.5 bg-muted/40 p-0.5 rounded-lg border border-border/50">
                <!-- All Tools List -->
                <button
                    type="button"
                    @click="openTools = !openTools"
                    class="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all active:scale-95 cursor-pointer"
                    :title="$t('main_tools_lists')"
                >
                    <Icon name="common" :size="14" />
                </button>

                <!-- Clear Content -->
                <button
                    type="button"
                    @click="event.dispatch('content_clear')"
                    class="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all active:scale-95 cursor-pointer"
                    :title="$t('main_content_clear')"
                >
                    <Icon name="clear" :size="14" />
                </button>

                <!-- History with Badge -->
                <button
                    type="button"
                    @click="openHistory = !openHistory"
                    class="relative p-1 rounded text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all active:scale-95 cursor-pointer"
                    :title="$t('tool_' + storeOperate.items.tool) + ' - ' + $t('main_history')"
                >
                    <Icon name="history" :size="14" />
                    <span
                        v-if="!storeSetting.items.history_icon_badge_hidden && historyExist"
                        class="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-destructive ring-1 ring-background"
                    />
                </button>

                <!-- Settings -->
                <button
                    type="button"
                    @click="event.dispatch('open_setting')"
                    class="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all active:scale-95 cursor-pointer"
                    :title="$t('main_ui_setting')"
                >
                    <Icon name="setting" :size="14" />
                </button>

                <!-- Fullscreen / Expand -->
                <button
                    type="button"
                    @click="openUrl()"
                    class="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all active:scale-95 cursor-pointer"
                    :title="$t('main_ui_open_full')"
                >
                    <Icon name="full" :size="14" />
                </button>
            </div>
        </div>
    </header>

    <ExtendPage v-model="openHistory">
        <History />
    </ExtendPage>
    <ExtendPage v-model="openTools">
        <Tools />
    </ExtendPage>
</template>

<script setup lang="ts">
import useOperate from "@/store/operate";
import useSetting from "@/store/setting";
import { openUrl } from "@/helper/helper";
import { getTool, toolExists, FeatureInterface } from "@/config";
import Search from "../../Search.vue";
import Github from "../../Github.vue";
import getHistoryInstance from "@/helper/history";
import { onMounted, onUnmounted } from "vue";
import event from "@/event";
import History from "../../History.vue";
import Tools from "../../Tools.vue";

const storeOperate = useOperate();
const storeSetting = useSetting();
let historyExist = $ref(false);
let openHistory = $ref(false);
let openTools = $ref(false);

const features = $computed(() => {
    return toolExists(storeOperate.items.tool) && !getTool(storeOperate.items.tool).isSimple()
        ? getTool(storeOperate.items.tool).features
        : [];
});

const updateHistoryExist = () => {
    historyExist = getHistoryInstance(storeOperate.items.tool, storeOperate.items.feature).length() > 0;
};

const selectFeature = (feature: FeatureInterface) => {
    storeOperate.redirectTool(storeOperate.items.tool, feature.name, storeOperate.items.category);
};

onMounted(() => {
    updateHistoryExist();
    event.addListener(["tool_change", "history_change"], updateHistoryExist);
});

onUnmounted(() => {
    event.removeListener(["tool_change", "history_change"], updateHistoryExist);
});
</script>
