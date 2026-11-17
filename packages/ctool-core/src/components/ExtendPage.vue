<template>
    <Teleport to="#ctool-append">
        <Transition name="extend-page">
            <div
                class="ctool-extend-page fixed z-[90] left-0 w-full bg-background/95 backdrop-blur-md overflow-y-auto p-3 shadow-xl border-b border-border/80"
                :style="style"
                v-if="show"
                v-bind="$attrs"
            >
                <slot></slot>
            </div>
        </Transition>
        <Transition name="extend-page-btn">
            <div
                class="ctool-extend-page-close fixed z-[91] bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center shadow-lg rounded-full"
                v-if="show"
            >
                <Button :size="'small'" :type="'primary'" @click="close" class="rounded-full shadow-md px-3.5">
                    <ChevronUp :size="13" class="mr-1" />
                    <span>{{ closeTextI18n }}</span>
                </Button>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts">
import Event from "@/event";

document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        Event.dispatch("extend_page_close");
    }
});

export default {
    inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { onMounted, onUnmounted, StyleValue, watch } from "vue";
import event, { componentResizeDispatch } from "@/event";
import { ChevronUp } from "lucide-vue-next";

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    disableReplace: {
        type: Boolean,
        default: false,
    },
    offset: {
        type: Number,
        default: 0,
    },
    closeText: {
        type: String,
        default: "",
    },
});

let closeI18n = $ref($t("main_ui_close"));
event.addListener("locale_change", () => {
    closeI18n = $t("main_ui_close");
});

const closeTextI18n = $computed(() => {
    return props.closeText || closeI18n;
});

const emit = defineEmits<{ (e: "update:modelValue", value: boolean): void }>();

let show = $computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit("update:modelValue", value),
});

let top = $ref(document.querySelector<HTMLElement>(".ctool-header")?.offsetHeight || 38);
let bottom = $ref(document.querySelector<HTMLElement>(".ctool-bottom")?.offsetHeight || 34);

const style = $computed(() => {
    const css: StyleValue = {
        top: `${top + props.offset}px`,
        height: `calc(100vh - ${top + bottom + props.offset}px)`,
    };
    return css;
});

let isCurrentOpen = false;

watch(
    () => show,
    is => {
        if (is && !props.disableReplace) {
            isCurrentOpen = true;
            event.dispatch("extend_page_close");
        }
        if (is) {
            setTimeout(() => {
                componentResizeDispatch();
            }, 300);
        }
    },
    { immediate: true },
);

const close = () => (show = false);

const closeExtendPageListener = () => {
    if (isCurrentOpen) {
        isCurrentOpen = false;
        return;
    }
    close();
};

const resize = () => {
    top = document.querySelector<HTMLElement>(".ctool-header")?.offsetHeight || 38;
    bottom = document.querySelector<HTMLElement>(".ctool-bottom")?.offsetHeight || 34;
};

onMounted(() => {
    event.addListener("extend_page_close", closeExtendPageListener);
    event.addListener("window_height_resize", resize);
});

onUnmounted(() => {
    event.removeListener("extend_page_close", closeExtendPageListener);
    event.removeListener("window_height_resize", resize);
});
</script>

<style scoped>
.extend-page-enter-active,
.extend-page-leave-active {
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.extend-page-enter-from,
.extend-page-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

.extend-page-btn-enter-active,
.extend-page-btn-leave-active {
    transition: all 0.2s ease;
}

.extend-page-btn-enter-from,
.extend-page-btn-leave-to {
    transform: translate(-50%, 20px);
    opacity: 0;
}
</style>
