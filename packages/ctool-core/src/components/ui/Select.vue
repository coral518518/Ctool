<template>
    <div
        class="ctool-select relative inline-flex items-center"
        :data-size="size"
        :data-type="type"
        :data-disabled="disabled ? 'y' : 'n'"
        :class="[
            disabled ? 'opacity-50 pointer-events-none' : '',
            sizeClasses
        ]"
        :style="containerStyle"
        ref="container"
    >
        <!-- Trigger Button -->
        <button
            type="button"
            @click="toggleDropdown"
            :disabled="disabled"
            class="relative inline-flex items-center justify-between w-full h-full rounded-md border border-input bg-card shadow-xs transition-all duration-150 hover:bg-accent/60 hover:border-border text-foreground px-2.5 outline-none focus-visible:ring-1 focus-visible:ring-primary overflow-hidden cursor-pointer"
        >
            <div class="flex items-center gap-1.5 overflow-hidden">
                <span
                    v-if="label !== '' && type === 'general'"
                    class="ctool-select-prepend -ml-2.5 mr-1 h-full px-2 py-1 bg-muted/60 border-r border-border text-muted-foreground text-xs font-medium flex items-center shrink-0 select-none"
                >
                    {{ label }}
                </span>
                <span class="truncate text-xs select-none" :class="selected === '__placeholder__' ? 'text-muted-foreground' : 'text-foreground font-medium'">
                    {{ placeholderValue }}
                </span>
            </div>
            <ChevronDown class="shrink-0 ml-1 text-muted-foreground transition-transform duration-200" :size="13" :class="isOpen ? 'rotate-180 text-primary' : ''" />
        </button>

        <!-- Dropdown Popover Listbox -->
        <div
            v-if="isOpen && !dialog"
            class="ctool-select-popover fixed z-[9999] min-w-[120px] max-h-60 overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg backdrop-blur-xs transition-all"
            :style="popoverStyle"
        >
            <div
                v-for="item in getOptions"
                :key="item.value"
                @click="onSelect(item.value)"
                class="relative flex cursor-pointer select-none items-center justify-between rounded px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground transition-colors group"
                :class="selected === item.value ? 'bg-primary/10 text-primary font-medium' : ''"
            >
                <div class="flex flex-col truncate pr-2">
                    <span class="truncate">{{ item.label }}</span>
                    <span v-if="item.description !== ''" class="text-[10px] text-muted-foreground truncate">{{ item.description }}</span>
                </div>
                <Check v-if="selected === item.value" class="shrink-0 text-primary" :size="12" />
            </div>
        </div>

        <!-- Dialog Mode Modal -->
        <Modal v-model="dialogShow" :title="label" padding="20px 10px" width="85%" @close="close">
            <Align horizontal="center">
                <Button
                    :type="selected === item.value ? 'primary' : 'general'"
                    v-for="item in getOptions"
                    :key="item.value"
                    @click="onSelect(item.value)"
                    :text="item.label"
                />
            </Align>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { PropType, ref, computed, onMounted, onUnmounted, StyleValue } from "vue";
import { isNumber, isString } from "lodash";
import { SelectOption, ComponentSizeType, SelectType, SelectValue } from "@/types";
import { sizeConvert } from "@/components/util";
import { ChevronDown, Check } from "lucide-vue-next";

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: "__placeholder__",
    },
    placeholder: {
        type: String,
        default: "",
    },
    size: {
        type: String as PropType<ComponentSizeType>,
        default: "default",
    },
    type: {
        type: String as PropType<SelectType>,
        default: "general",
    },
    options: {
        type: Array as PropType<SelectOption>,
        default: () => [],
    },
    label: {
        type: String,
        default: "",
    },
    width: {
        type: [Number, String],
        default: "",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    dialog: {
        type: Boolean,
        default: false,
    },
    disabledDialogClickClose: {
        type: Boolean,
        default: false,
    },
    center: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits<{
    (e: "update:modelValue", value: SelectValue): void;
    (e: "change", value: SelectValue): void;
}>();

const container = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const dialogShow = ref(false);
const popoverPosition = ref<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

const getOptions = computed(() => {
    let items: Array<{ value: SelectValue; label: string; description: string }> = [];
    for (let item of props.options) {
        if (isNumber(item) || isString(item)) {
            items.push({ value: item, label: `${item}`, description: "" });
        } else {
            items.push({ value: item.value, label: `${item.label}`, description: item.description || "" });
        }
    }
    return items;
});

const selected = computed({
    get: () => props.modelValue,
    set: (value: SelectValue) => {
        emit("update:modelValue", value);
        emit("change", value);
    },
});

const placeholderValue = computed(() => {
    if (selected.value !== "__placeholder__") {
        const found = getOptions.value.find(item => item.value === selected.value);
        if (found) return found.label;
    }
    return props.placeholder || (getOptions.value[0]?.label ?? "");
});

const containerStyle = computed(() => {
    let css: StyleValue = {};
    css.width = props.width ? sizeConvert(props.width) : "auto";
    return css;
});

const sizeClasses = computed(() => {
    switch (props.size) {
        case "small":
            return "h-[26px] text-xs";
        case "large":
            return "h-[38px] text-sm";
        default:
            return "h-[30px] text-xs";
    }
});

const updatePopoverPosition = () => {
    if (!container.value) return;
    const rect = container.value.getBoundingClientRect();
    const dropdownHeight = 180;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top = spaceBelow >= dropdownHeight || spaceBelow >= rect.top ? rect.bottom + 4 : rect.top - dropdownHeight - 4;
    popoverPosition.value = {
        top: Math.max(8, top),
        left: rect.left,
        width: Math.max(rect.width, 130),
    };
};

const popoverStyle = computed(() => {
    return {
        top: `${popoverPosition.value.top}px`,
        left: `${popoverPosition.value.left}px`,
        minWidth: `${popoverPosition.value.width}px`,
    };
});

const toggleDropdown = () => {
    if (props.disabled) return;
    if (props.dialog) {
        dialogShow.value = true;
        return;
    }
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        updatePopoverPosition();
    }
};

const onSelect = (val: SelectValue) => {
    selected.value = val;
    if (props.dialog && props.disabledDialogClickClose) {
        return;
    }
    close();
};

const close = () => {
    isOpen.value = false;
    dialogShow.value = false;
};

const handleClickOutside = (e: MouseEvent) => {
    if (!container.value) return;
    const target = e.target as Node;
    if (!container.value.contains(target) && !document.querySelector(".ctool-select-popover")?.contains(target)) {
        close();
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", updatePopoverPosition);
    window.addEventListener("scroll", updatePopoverPosition, true);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
    window.removeEventListener("resize", updatePopoverPosition);
    window.removeEventListener("scroll", updatePopoverPosition, true);
});
</script>

<style>
.ctool-select {
    height: var(--ctool-form-item-height);
}
</style>
