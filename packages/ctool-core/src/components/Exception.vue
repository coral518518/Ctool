<template>
    <div class="ctool-exception w-full h-full flex flex-col justify-center items-center gap-2 p-6 select-none">
        <div class="p-3 rounded-full bg-muted/50 border border-border/60 text-muted-foreground/70">
            <AlertCircle v-if="content !== ''" :size="24" class="text-destructive" />
            <Inbox v-else :size="24" />
        </div>
        <div class="text-xs text-muted-foreground font-medium text-center max-w-[260px] leading-relaxed">
            {{ props.content ? props.content : $t("main_ui_null") }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { Inbox, AlertCircle } from "lucide-vue-next";

const props = defineProps({
    content: {
        type: String,
        default: "",
    },
});
</script>
