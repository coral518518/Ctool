<template>
    <div :style="style" class="ctool-message fixed left-1/2 -translate-x-1/2 z-[10000] pointer-events-none" ref="container">
        <Transition name="toast">
            <div
                v-if="show"
                :class="[
                    'ctool-message-block pointer-events-auto flex items-center gap-2 w-fit max-w-[calc(100vw-3rem)] rounded-lg border px-3.5 py-2 text-xs font-medium shadow-xl backdrop-blur-md transition-all select-none',
                    toastVariantClasses
                ]"
            >
                <CheckCircle2 v-if="type === 'success'" :size="15" class="text-primary shrink-0" />
                <AlertCircle v-else-if="type === 'error'" :size="15" class="text-destructive shrink-0" />
                <Info v-else :size="15" class="text-muted-foreground shrink-0" />

                <div class="ctool-message-content max-h-[calc(100vh-6rem)] overflow-y-auto leading-relaxed select-text">
                    <template v-if="!info.includes('\n')">
                        {{ info }}
                    </template>
                    <pre v-else class="font-mono text-[11px] m-0 bg-transparent text-inherit"><code>{{ info }}</code></pre>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { PropType, StyleValue, onMounted, onUnmounted, computed } from "vue";
import { MessageType } from "@/types";
import { sizeConvert } from "./util";
import { CheckCircle2, AlertCircle, Info } from "lucide-vue-next";

const props = defineProps({
    type: {
        type: String as PropType<MessageType>,
        default: "info",
    },
    info: {
        type: String,
        default: "",
    },
    offset: {
        type: Number,
        default: 0,
    },
    close: {
        type: Function,
        default() {},
    },
});

const container = $ref<HTMLElement | null>(null);
let show = $ref(false);

const open = () => {
    show = true;
};

const exposeClose = () => {
    show = false;
};

const style = $computed(() => {
    const css: StyleValue = {
        top: sizeConvert(props.offset || 48),
    };
    return css;
});

const toastVariantClasses = computed(() => {
    switch (props.type) {
        case "success":
            return "bg-card/95 border-primary/40 text-foreground shadow-primary/5";
        case "error":
            return "bg-card/95 border-destructive/40 text-destructive shadow-destructive/5";
        case "info":
        default:
            return "bg-card/95 border-border text-foreground";
    }
});

const clickClose = (event: MouseEvent) => {
    if (!container?.contains(event.target as any)) {
        props.close();
    }
};

onMounted(() => {
    setTimeout(() => document.addEventListener("click", clickClose), 100);
});

onUnmounted(() => {
    document.removeEventListener("click", clickClose);
});

defineExpose({ open, exposeClose });
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from,
.toast-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}
</style>
