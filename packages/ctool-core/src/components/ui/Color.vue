<template>
    <div
        class="ctool-color inline-flex items-center rounded-md border border-input bg-card shadow-xs overflow-hidden h-[30px]"
        :data-size="size"
        :style="style"
    >
        <div class="ctool-color-prepend px-2 bg-muted/50 border-r border-border text-muted-foreground text-xs font-medium h-full flex items-center select-none" v-if="label !== ''">
            {{ label }}
        </div>
        <div class="p-1 flex items-center justify-center">
            <input
                type="color"
                v-model="current"
                :disabled="disabled"
                class="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0 outline-none"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, StyleValue } from "vue";
import { ComponentSizeType } from "@/types";

const props = defineProps({
    modelValue: {
        type: String,
        default: "#666666",
    },
    size: {
        type: String as PropType<ComponentSizeType>,
        default: "default",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
        default: "",
    },
});

const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();

const current = $computed({
    get: () => props.modelValue,
    set: (value: string) => emit("update:modelValue", value),
});

const style = $computed(() => {
    let css: StyleValue = {};
    return css;
});
</script>
