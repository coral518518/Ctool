<template>
    <footer class="ctool-bottom h-[34px] px-3 border-t border-border/80 bg-card/60 backdrop-blur-sm flex items-center gap-2 select-none shrink-0 z-20 overflow-hidden">
        <button
            type="button"
            class="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0 flex items-center gap-1"
            @click="openTools = !openTools"
        >
            <span>{{ $t("main_category_common") }}:</span>
        </button>

        <div class="ctool-bottom-tools flex items-center gap-1 overflow-x-auto h-full py-1">
            <button
                v-for="tool in tools"
                :key="tool.name"
                type="button"
                :class="[
                    'px-2 py-0.5 text-xs rounded-md transition-all duration-150 whitespace-nowrap cursor-pointer select-none',
                    storeOperate.items.tool === tool.name
                        ? 'bg-primary/15 text-primary font-semibold border border-primary/25 shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                ]"
                @click="redirectTool(tool.name)"
            >
                {{ $t(`tool_${tool.name}`) }}
            </button>
        </div>
    </footer>

    <ExtendPage v-model="openTools">
        <Tools />
    </ExtendPage>
</template>

<script setup lang="ts">
import useSetting from "@/store/setting";
import Tools from "../../Tools.vue";
import { getTool } from "@/config";
import useOperate from "@/store/operate";

const storeSetting = useSetting();
const storeOperate = useOperate();
let openTools = $ref(false);

const tools = $computed(() => {
    return storeSetting.items.common.map(name => {
        return getTool(name);
    });
});

const redirectTool = (tool: string) => storeOperate.redirectTool(tool);
</script>
