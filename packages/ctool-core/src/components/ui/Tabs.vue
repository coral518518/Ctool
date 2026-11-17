<template>
    <div class="ctool-tabs bg-card border border-border/70 rounded-lg shadow-xs overflow-hidden" ref="container" :style="{ ...(height ? { height: sizeConvert(height) } : {}) }">
        <div class="ctool-tabs-header flex items-center justify-between px-2.5 py-1.5 bg-muted/30 border-b border-border/60 min-h-[36px]">
            <div class="ctool-tabs-header-item inline-flex items-center p-0.5 rounded-md bg-muted/60 border border-border/50 gap-0.5">
                <span
                    v-for="item in lists"
                    :key="item.name"
                    @click="current = item.name"
                    :class="[
                        'px-2.5 py-1 text-xs rounded transition-all duration-150 cursor-pointer select-none',
                        current === item.name
                            ? 'bg-background text-primary font-semibold shadow-xs'
                            : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                    ]"
                >
                    {{ item.label }}
                </span>
            </div>
            <div class="ctool-tabs-header-fill flex items-center gap-2 text-xs pl-2">
                <slot name="extra" />
            </div>
        </div>
        <div class="ctool-tabs-body overflow-y-auto w-full h-full" :style="{ padding: `${padding}` }" v-if="currentIndex !== -1" :class="`ctool-tabs-current-${currentIndex}`">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, PropType, watch } from "vue";
import { TabsListsType } from "@/types";
import { heightResizeDispatch } from "@/event";
import { sizeConvert } from "../util";

const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    lists: {
        type: Array as PropType<TabsListsType>,
        default: () => [],
    },
    padding: {
        type: String,
        default: "5px",
    },
    height: {
        type: [Number, String],
        default: "",
    },
});

const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();

const container = $ref<HTMLElement | null>(null);
let currentIndex = $ref(-1);
let current = $ref(props.modelValue);

const update = async () => {
    if (!container) {
        return;
    }
    let index = 0;
    for (let i = 0; i < props.lists.length; i++) {
        if (props.lists[i].name === current) {
            index = i;
            break;
        }
    }
    currentIndex = index;
    await nextTick();
    heightResizeDispatch();
};

onMounted(() => {
    update();
});

watch(
    () => current,
    value => {
        update();
        emit("update:modelValue", value);
    },
);

watch(
    () => props.modelValue,
    value => {
        if (value !== current) {
            current = value;
        }
    },
);
</script>

<style>
.ctool-tabs {
    width: 100%;
    display: grid;
    grid-template-rows: auto minmax(0px, 1fr);
    height: auto;
}

.ctool-tabs-current-0 > *:not(:nth-child(1)) {
    display: none !important;
}

.ctool-tabs-current-1 > *:not(:nth-child(2)) {
    display: none !important;
}

.ctool-tabs-current-2 > *:not(:nth-child(3)) {
    display: none !important;
}

.ctool-tabs-current-3 > *:not(:nth-child(4)) {
    display: none !important;
}

.ctool-tabs-current-4 > *:not(:nth-child(5)) {
    display: none !important;
}

.ctool-tabs-current-5 > *:not(:nth-child(6)) {
    display: none !important;
}

.ctool-tabs-current-6 > *:not(:nth-child(7)) {
    display: none !important;
}

.ctool-tabs-current-7 > *:not(:nth-child(8)) {
    display: none !important;
}
</style>
