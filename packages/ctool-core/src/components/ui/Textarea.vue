<template>
    <div
        class="ctool-textarea relative w-full h-full rounded-md border border-input bg-card shadow-xs transition-all duration-150 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/40 overflow-hidden"
        :style="{ height: sizeConvert(height) }"
        :data-disabled="disabled ? 'y' : 'n'"
        :class="disabled ? 'opacity-50 pointer-events-none' : ''"
    >
        <Display
            :enable="floatButtonText !== ''"
            :position="floatPosition"
            :type="floatType"
            :text="floatButtonText"
            @click="clickFloatText"
            style="height: 100%"
        >
            <textarea
                class="w-full h-full bg-transparent p-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none border-none resize-none font-mono leading-relaxed select-text"
                :style="{ resize: 'none' }"
                :disabled="disabled"
                :readonly="readonly"
                :placeholder="placeholder"
                v-model="current"
            />
        </Display>
    </div>
</template>

<script setup lang="ts">
import { PropType, onMounted, onUnmounted } from "vue";
import { ButtonType, DisplayPosition } from "@/types";
import { sizeConvert } from "@/components/util";
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
    height: {
        type: [Number, String],
        default: "",
    },
    copy: {
        type: [Boolean, String],
        default: false,
    },
    floatText: {
        type: String,
        default: "",
    },
    floatPosition: {
        type: String as PropType<DisplayPosition>,
        default: "bottom-right",
    },
    floatType: {
        type: String as PropType<ButtonType>,
        default: "primary",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    disableClear: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits<{ (e: "update:modelValue", value: string): void; (e: "clickFloatText"): void }>();

let current = $computed({
    get: () => props.modelValue,
    set: (value: string) => {
        emit("update:modelValue", value);
    },
});

const clearListener = () => {
    current = "";
};

onMounted(() => {
    if (!props.disableClear) {
        event.addListener("content_clear", clearListener);
    }
});

onUnmounted(() => {
    if (!props.disableClear) {
        event.removeListener("content_clear", clearListener);
    }
});

const clickFloatText = () => {
    if (props.floatText !== "") {
        return emit("clickFloatText");
    }
    if (props.copy !== false) {
        return $copy(current);
    }
};

const floatButtonText: string = $computed(() => {
    if (props.floatText !== "") {
        return props.floatText;
    }
    if (props.copy !== false) {
        return props.copy === true ? $t("main_ui_copy") : props.copy;
    }
    return "";
});
</script>
