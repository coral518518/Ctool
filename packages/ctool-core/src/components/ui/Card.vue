<template>
    <div class="ctool-card bg-card border border-border/70 rounded-lg shadow-xs overflow-hidden" :style="style">
        <div class="ctool-card-header flex items-center justify-between px-3.5 py-1.5 bg-muted/40 border-b border-border/60 min-h-[34px]" v-if="title !== ''">
            <div class="ctool-card-title text-xs font-semibold text-foreground tracking-tight">{{ title }}</div>
            <div class="ctool-card-extra text-xs text-muted-foreground flex items-center gap-2">
                <slot name="extra"></slot>
            </div>
        </div>
        <div class="ctool-card-body overflow-y-auto w-full h-full" :style="{ padding: `${padding}` }" ref="body">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { sizeConvert } from "../util";
import { StyleValue, onMounted, onUnmounted } from "vue";
import { componentResizeDispatch } from "@/event";

const props = defineProps({
    title: {
        type: String,
        default: "",
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

const body = $ref<HTMLElement | null>(null);

onMounted(() => {
    body?.addEventListener("scroll", componentResizeDispatch);
});

onUnmounted(() => {
    body?.removeEventListener("scroll", componentResizeDispatch);
});

const style = $computed(() => {
    let css: StyleValue = {};
    if (props.height) {
        css.height = sizeConvert(props.height);
    }
    if (props.title === "") {
        css.gridTemplateRows = "minmax(0px, 1fr)";
    }
    return css;
});
</script>

<style>
.ctool-card {
    width: 100%;
    display: grid;
    grid-template-rows: auto minmax(0px, 1fr);
    height: auto;
}
</style>
