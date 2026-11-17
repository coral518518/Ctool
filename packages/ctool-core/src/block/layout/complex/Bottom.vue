<template>
    <footer class="ctool-bottom h-[34px] px-3 border-t border-border/80 bg-card/60 backdrop-blur-sm flex items-center justify-between select-none shrink-0 z-20">
        <div class="text-[11px] text-muted-foreground font-mono">
            Ctool
        </div>

        <div class="flex items-center gap-1 bg-muted/40 p-0.5 rounded-lg border border-border/50">
            <!-- Clear -->
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

            <!-- Setting -->
            <button
                type="button"
                @click="event.dispatch('open_setting')"
                class="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all active:scale-95 cursor-pointer"
                :title="$t('main_ui_setting')"
            >
                <Icon name="setting" :size="14" />
            </button>

            <!-- Fullscreen -->
            <button
                type="button"
                @click="openUrl()"
                class="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all active:scale-95 cursor-pointer"
                :title="$t('main_ui_open_full')"
            >
                <Icon name="full" :size="14" />
            </button>
        </div>
    </footer>

    <ExtendPage v-model="openHistory">
        <History />
    </ExtendPage>
</template>

<script setup lang="ts">
import useOperate from "@/store/operate";
import useSetting from "@/store/setting";
import History from "../../History.vue";
import { openUrl } from "@/helper/helper";
import getHistoryInstance from "@/helper/history";
import { onMounted, onUnmounted } from "vue";
import event from "@/event";

const storeOperate = useOperate();
const storeSetting = useSetting();

let openHistory = $ref(false);
let historyExist = $ref(false);

const updateHistoryExist = () => {
    historyExist = getHistoryInstance(storeOperate.items.tool, storeOperate.items.feature).length() > 0;
};

onMounted(() => {
    updateHistoryExist();
    event.addListener(["tool_change", "history_change"], updateHistoryExist);
});
onUnmounted(() => {
    event.removeListener(["tool_change", "history_change"], updateHistoryExist);
});
</script>
