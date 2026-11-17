<template>
    <div
        class="ctool-bool inline-flex items-center cursor-pointer select-none transition-all duration-150"
        :class="[
            disabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : '',
            border ? 'border border-border/80 hover:border-primary/50 rounded-md px-2.5 py-1 bg-card shadow-xs' : '',
            checked && border ? 'border-primary/60 bg-primary/5' : ''
        ]"
        :data-size="size"
        :data-border="border ? 'y' : 'n'"
        :data-checked="checked ? 'y' : 'n'"
        :data-disabled="disabled ? 'y' : 'n'"
        @click="toggle"
    >
        <div class="flex items-center gap-2">
            <!-- Modern Switch Slider -->
            <button
                type="button"
                role="switch"
                :aria-checked="checked"
                :disabled="disabled"
                :class="[
                    'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    trackSizeClasses,
                    checked ? 'bg-primary' : 'bg-muted-foreground/25 dark:bg-muted'
                ]"
            >
                <span
                    :class="[
                        'pointer-events-none block rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out',
                        thumbSizeClasses,
                        checked ? translateClasses : 'translate-x-0'
                    ]"
                />
            </button>
            <span v-if="label !== ''" :class="['font-medium text-foreground leading-none', labelSizeClasses]">
                {{ label }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed } from "vue";
import { ComponentSizeType } from "@/types";

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    border: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String as PropType<ComponentSizeType>,
        default: "default",
    },
    label: {
        type: String,
        default: "",
    },
});

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "change", value: boolean): void;
}>();

let checked = $computed({
    get: () => props.modelValue,
    set: (value: boolean) => {
        emit("update:modelValue", value);
        emit("change", value);
    },
});

const toggle = () => {
    if (props.disabled) return;
    checked = !checked;
};

const trackSizeClasses = computed(() => {
    switch (props.size) {
        case "small":
            return "h-[16px] w-[28px]";
        case "large":
            return "h-[24px] w-[44px]";
        default:
            return "h-[18px] w-[32px]";
    }
});

const thumbSizeClasses = computed(() => {
    switch (props.size) {
        case "small":
            return "h-[12px] w-[12px]";
        case "large":
            return "h-[20px] w-[20px]";
        default:
            return "h-[14px] w-[14px]";
    }
});

const translateClasses = computed(() => {
    switch (props.size) {
        case "small":
            return "translate-x-[12px]";
        case "large":
            return "translate-x-[20px]";
        default:
            return "translate-x-[14px]";
    }
});

const labelSizeClasses = computed(() => {
    switch (props.size) {
        case "small":
            return "text-[11px]";
        case "large":
            return "text-sm";
        default:
            return "text-xs";
    }
});
</script>

<style>
.ctool-bool {
    height: var(--ctool-form-item-height);
}
</style>
