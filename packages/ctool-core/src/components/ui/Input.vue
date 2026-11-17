<template>
    <div
        class="ctool-input relative inline-flex items-stretch w-full rounded-md border border-input bg-card shadow-xs transition-all duration-150 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/40 overflow-hidden"
        :style="style"
        :data-size="size"
        :data-disabled="disabled ? 'y' : 'n'"
        :class="[
            disabled ? 'opacity-50 pointer-events-none' : '',
            sizeClasses
        ]"
    >
        <!-- Prepend / Label -->
        <div class="ctool-input-prepend shrink-0 flex items-center bg-muted/50 border-r border-border text-muted-foreground text-xs font-medium px-2.5 select-none" v-if="$slots.prepend || label !== ''">
            <slot name="prepend">{{ label }}</slot>
        </div>

        <!-- Prefix Slot -->
        <div class="ctool-input-prefix shrink-0 flex items-center text-muted-foreground pl-2 text-xs" v-if="$slots.prefix">
            <slot name="prefix"></slot>
        </div>

        <!-- HTML Input Element -->
        <input
            ref="container"
            v-model="content"
            :placeholder="placeholder"
            :style="inputStyle"
            :disabled="disabled"
            :readonly="readonly"
            :type="type"
            class="w-full flex-1 bg-transparent px-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none border-none shadow-none disabled:cursor-not-allowed"
            v-bind="$attrs"
        />

        <!-- Suffix Slot -->
        <div class="ctool-input-suffix shrink-0 flex items-center text-muted-foreground pr-2 text-xs" v-if="$slots.suffix">
            <slot name="suffix"></slot>
        </div>

        <!-- Append Slot -->
        <div class="ctool-input-append shrink-0 flex items-center bg-muted/50 border-l border-border text-muted-foreground text-xs font-medium px-2.5 select-none" v-if="$slots.append">
            <slot name="append"></slot>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, PropType, StyleValue } from "vue";
import { sizeConvert } from "../util";
import { ComponentSizeType } from "@/types";
import event from "@/event";

const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    placeholder: {
        type: String,
        default: "",
    },
    width: {
        type: [Number, String],
        default: "",
    },
    size: {
        type: String as PropType<ComponentSizeType>,
        default: "default",
    },
    label: {
        type: String,
        default: "",
    },
    type: {
        type: String as PropType<"text" | "number">,
        default: "text",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    center: {
        type: Boolean,
        default: false,
    },
    disableClear: {
        type: Boolean,
        default: false,
    },
});

const container = $ref<HTMLInputElement | null>(null);

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "load", value: HTMLInputElement): void;
    (e: "change", value: string): void;
}>();

let content = $computed({
    get: () => props.modelValue,
    set: (value: string) => {
        emit("update:modelValue", value);
        emit("change", value);
    },
});

const style = $computed(() => {
    let css: StyleValue = {};
    if (props.width !== "") {
        css.width = sizeConvert(props.width);
    }
    return css;
});

const inputStyle = $computed(() => {
    let css: StyleValue = {};
    if (props.center) {
        css["text-align"] = "center";
    }
    return css;
});

const sizeClasses = computed(() => {
    switch (props.size) {
        case "small":
            return "h-[26px] text-xs";
        case "large":
            return "h-[38px] text-sm";
        default:
            return "h-[30px] text-xs";
    }
});

const clearListener = () => {
    content = "";
};

onMounted(() => {
    if (!props.disableClear) {
        event.addListener("content_clear", clearListener);
    }
    if (container) {
        emit("load", container as HTMLInputElement);
    }
});

onUnmounted(() => {
    if (!props.disableClear) {
        event.removeListener("content_clear", clearListener);
    }
});
</script>

<style>
.ctool-input {
    height: var(--ctool-form-item-height);
}
.ctool-input input {
    height: 100%;
}
</style>
