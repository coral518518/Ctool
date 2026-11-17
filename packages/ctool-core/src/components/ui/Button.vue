<template>
    <Tooltip :content="props.tooltip">
        <div
            class="ctool-button inline-flex"
            :data-size="props.size"
            :data-type="props.type"
            :class="props.long ? 'w-full' : 'w-auto'"
            :style="props.long ? { width: '100%' } : {}"
        >
            <button
                @click="click"
                :disabled="props.disabled || props.loading"
                :aria-busy="props.loading ? 'true' : 'false'"
                :class="[
                    'relative inline-flex items-center justify-center font-medium select-none outline-none transition-all duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-50',
                    props.long ? 'w-full' : 'w-auto',
                    sizeClasses,
                    variantClasses
                ]"
            >
                <Loader2 v-if="props.loading" class="animate-spin shrink-0 mr-1.5" :size="iconSize" />
                <slot>{{ text }}</slot>
            </button>
        </div>
    </Tooltip>
</template>

<script setup lang="ts">
import { PropType, computed } from "vue";
import { ButtonType, ComponentSizeType } from "@/types";
import { Loader2 } from "lucide-vue-next";

const props = defineProps({
    type: {
        type: String as PropType<ButtonType>,
        default: "general",
    },
    size: {
        type: String as PropType<ComponentSizeType>,
        default: "default",
    },
    text: {
        type: String,
        default: "",
    },
    long: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    tooltip: {
        type: String,
        default: "",
    },
});

const emit = defineEmits<{ (e: "click"): void }>();

const click = () => emit("click");

const sizeClasses = computed(() => {
    switch (props.size) {
        case "small":
            return "h-[24px] px-2 text-xs rounded";
        case "large":
            return "h-[38px] px-4 text-sm rounded-md";
        default:
            return "h-[30px] px-3 text-xs rounded-md";
    }
});

const iconSize = computed(() => {
    switch (props.size) {
        case "small":
            return 11;
        case "large":
            return 16;
        default:
            return 13;
    }
});

const variantClasses = computed(() => {
    switch (props.type) {
        case "primary":
            return "bg-primary text-white font-semibold shadow-sm hover:brightness-105 active:scale-[0.98]";
        case "dotted":
            return "border border-dashed border-border/80 bg-card/60 text-foreground hover:border-primary/60 hover:text-primary hover:bg-accent/40 active:scale-[0.98]";
        case "danger":
            return "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.98]";
        case "general":
        default:
            return "border border-border/80 bg-card text-foreground shadow-xs hover:bg-accent/80 hover:text-accent-foreground hover:border-border active:scale-[0.98]";
    }
});
</script>

<style>
.ctool-button {
    height: var(--ctool-form-item-height);
}
.ctool-button button {
    height: 100%;
}
</style>
