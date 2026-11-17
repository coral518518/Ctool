<template>
    <Input
        v-model="current"
        type="number"
        :max="max"
        :min="min"
        :step="step"
        :size="size"
        :width="width"
        :disabled="disabled"
        center
    >
        <template #prepend v-if="$slots.prepend">
            <slot name="prepend"></slot>
        </template>
        <template #append v-if="$slots.append">
            <slot name="append"></slot>
        </template>
        <template #suffix v-if="$slots.suffix">
            <slot name="suffix"></slot>
        </template>
        <template #prefix v-if="$slots.prefix">
            <slot name="prefix"></slot>
        </template>
    </Input>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { toNumber } from "lodash";
import { ComponentSizeType } from "@/types";

const props = defineProps({
    modelValue: {
        type: Number,
        default: 1,
    },
    step: {
        type: [Number, String],
        default: "any",
    },
    min: {
        type: [Number, Boolean],
        default: 0,
    },
    max: {
        type: [Number, Boolean],
        default: false,
    },
    size: {
        type: String as PropType<ComponentSizeType>,
        default: "default",
    },
    width: {
        type: [Number, String],
        default: "",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits<{
    (e: "update:modelValue", value: number): void;
    (e: "change", value: number): void;
}>();

const current = $computed({
    get: () => `${props.modelValue}`,
    set: (value: string) => {
        const _value = toNumber(`${value}`);
        emit("update:modelValue", _value);
        emit("change", _value);
    },
});
</script>
