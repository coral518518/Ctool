<template>
    <Teleport to="#ctool-append">
        <Transition name="fade">
            <div
                v-if="show"
                class="ctool-modal-backdrop fixed inset-0 z-[9990] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none"
                @click.self="show = false"
            >
                <div
                    class="ctool-modal-card relative flex flex-col rounded-xl border border-border/80 bg-card text-card-foreground shadow-2xl overflow-hidden transition-all duration-200 max-h-[85vh]"
                    :style="{ width: sizeConvert(width) }"
                    @click.stop
                >
                    <!-- Header -->
                    <div class="ctool-modal-header flex items-center justify-between px-4 py-2.5 border-b border-border/70 bg-muted/30" v-if="props.title !== ''">
                        <span class="text-xs font-semibold text-foreground tracking-tight">{{ title }}</span>
                        <button
                            type="button"
                            @click="show = false"
                            class="rounded-sm p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                            <X :size="14" />
                        </button>
                    </div>

                    <!-- Main Body -->
                    <div class="ctool-modal-body overflow-y-auto select-text" :style="bodyStyle">
                        <slot></slot>
                    </div>

                    <!-- Footer -->
                    <div
                        class="ctool-modal-footer flex items-center justify-end gap-2 px-4 py-2.5 border-t border-border/70 bg-muted/20"
                        v-if="$slots.footer || footerType !== 'none'"
                    >
                        <slot name="footer">
                            <Align v-if="footerType === 'normal'">
                                <Button type="general" size="small" @click="show = false; emit('cancel')" :text="$t('main_ui_cancel')" />
                                <Button :loading="loading" size="small" type="primary" @click="emit('ok')" :text="$t('main_ui_ok')" />
                            </Align>
                            <Button :loading="loading" v-if="footerType === 'long'" size="small" type="primary" long @click="emit('ok')" :text="$t('main_ui_ok')" />
                        </slot>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { PropType, onMounted, onUnmounted, computed, StyleValue } from "vue";
import { ModalFooterType } from "@/types";
import { sizeConvert } from "./util";
import { X } from "lucide-vue-next";

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: "",
    },
    width: {
        type: [Number, String],
        default: "60%",
    },
    padding: {
        type: String,
        default: "12px 16px",
    },
    footerType: {
        type: String as PropType<ModalFooterType>,
        default: "none",
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits<{
    (e: "update:modelValue", modelValue: boolean): void;
    (e: "ok"): void;
    (e: "cancel"): void;
    (e: "close"): void;
}>();

let show = $computed({
    get: () => props.modelValue,
    set: (value: boolean) => {
        emit("update:modelValue", value);
        if (!value) emit("close");
    },
});

const bodyStyle = computed(() => {
    let css: StyleValue = {};
    if (props.padding) {
        css.padding = props.padding;
    }
    return css;
});

const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && show) {
        show = false;
    }
};

onMounted(() => {
    document.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
    document.removeEventListener("keydown", onKeydown);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active .ctool-modal-card,
.fade-leave-active .ctool-modal-card {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.fade-enter-from .ctool-modal-card,
.fade-leave-to .ctool-modal-card {
    opacity: 0;
    transform: scale(0.96);
}
</style>
