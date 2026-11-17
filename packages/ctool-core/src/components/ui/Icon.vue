<template>
    <Tooltip :content="tooltip">
        <i
            :class="classes"
            :style="{ ...(size ? { '--font-size': isNumber(size) ? `${size}px` : `${size}` } : {}) }"
            v-bind="$attrs"
        >
            <template v-if="IconComponent !== null">
                <IconComponent @click="click" :style="style" />
            </template>
        </i>
    </Tooltip>
</template>

<script lang="ts">
export default {
    inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { load, IconType } from "@/helper/icon";
import { computed, PropType, StyleValue, watch } from "vue";
import { isNumber } from "lodash";
import Tooltip from "./Tooltip.vue";

const props = defineProps({
    name: {
        type: String as PropType<IconType>,
        default: "",
    },
    color: {
        type: String,
        default: "",
    },
    reverse: {
        type: Boolean,
        default: false,
    },
    hover: {
        type: Boolean,
        default: false,
    },
    highlight: {
        type: Boolean,
        default: false,
    },
    size: {
        type: [String, Number],
        default: 0,
    },
    tooltip: {
        type: String,
        default: "",
    },
    rotate: {
        type: Number,
        default: 0,
    },
});

let IconComponent: any = $ref(null);

watch(
    () => props.name,
    async name => {
        IconComponent = await load(name);
    },
    { immediate: true },
);

const style = computed(() => {
    const css: StyleValue = {};
    if (props.color) {
        css.color = props.color;
    }
    if (props.rotate) {
        css.transform = `rotate(${props.rotate}deg)`;
    }
    return css;
});

const classes = computed(() => {
    let lists: string[] = ["ctool-icon inline-flex items-center justify-center"];
    if (props.reverse) {
        lists.push("ctool-icon-reverse");
    }
    if (props.hover) {
        lists.push("ctool-icon-hover cursor-pointer rounded p-0.5 hover:bg-accent/80 hover:text-primary transition-colors");
    }
    if (props.highlight) {
        lists.push("ctool-icon-highlight text-primary");
    }
    return lists;
});

const emit = defineEmits<{ (e: "click"): void }>();

const click = () => {
    emit("click");
};
</script>

<style>
.ctool-icon {
    --font-size: 1rem;
    fill: currentColor;
    width: var(--font-size);
    height: var(--font-size);
    display: inline-flex;
    overflow: visible;
    box-sizing: content-box;
    transition: all 0.15s ease;
}

.ctool-icon svg {
    width: 100%;
    height: 100%;
}

.ctool-icon-reverse {
    color: var(--background-color);
}
</style>
