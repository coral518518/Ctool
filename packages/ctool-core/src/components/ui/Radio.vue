<template>
    <div
        class="ctool-radio inline-flex items-center p-0.5 rounded-lg bg-muted/60 border border-border/50 gap-0.5 select-none"
        :class="disabled ? 'opacity-50 pointer-events-none' : ''"
    >
        <button
            v-for="item in getOptions"
            :key="item.value"
            type="button"
            :disabled="disabled"
            @click="select(item.value)"
            :class="[
                'font-medium transition-all duration-150 cursor-pointer select-none whitespace-nowrap outline-none',
                sizeClasses,
                item.value === current
                    ? 'bg-background text-primary font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
            ]"
        >
            {{ item.label }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed } from "vue";
import { isNumber, isString } from "lodash";
import { ComponentSizeType, RadioOption, RadioValue } from "@/types";

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: "",
    },
    options: {
        type: Array as PropType<RadioOption>,
        default: () => [],
    },
    size: {
        type: String as PropType<ComponentSizeType>,
        default: "default",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits<{
    (e: "update:modelValue", value: RadioValue): void;
    (e: "change", value: RadioValue): void;
}>();

let current = $computed({
    get: () => props.modelValue,
    set: (value: RadioValue) => {
        emit("update:modelValue", value);
        emit("change", value);
    },
});

const getOptions = $computed(() => {
    let items: Array<{ value: RadioValue; label: string }> = [];
    for (let item of props.options) {
        if (isNumber(item) || isString(item)) {
            items.push({ value: item, label: `${item}` });
        } else {
            items.push({ value: item.value, label: `${item.label}` });
        }
    }
    return items;
});

const sizeClasses = computed(() => {
    switch (props.size) {
        case "small":
            return "h-[22px] px-2 text-[11px] rounded";
        case "large":
            return "h-[34px] px-3.5 text-sm rounded-md";
        default:
            return "h-[26px] px-2.5 text-xs rounded-md";
    }
});

const select = (value: string | number) => {
    current = value;
};
</script>
