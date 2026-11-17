<template>
    <Tooltip :content="tooltip">
        <a
            class="ctool-link inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 underline-offset-4 hover:underline cursor-pointer transition-colors duration-150"
            :data-type="type"
            @click="click"
            v-bind="$attrs"
        >
            <slot></slot>
        </a>
    </Tooltip>
</template>

<script lang="ts">
export default {
    inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { openUrl } from "@/helper/helper";
import { PropType } from "vue";
import { LinkType } from "@/types";

const props = defineProps({
    href: {
        type: String,
        default: "",
    },
    type: {
        type: String as PropType<LinkType>,
        default: "default",
    },
    tooltip: {
        type: String,
        default: "",
    },
});

const emit = defineEmits<{ (e: "click"): void }>();

const click = () => {
    if (props.href !== "") {
        openUrl(props.href);
    }
    emit("click");
    return false;
};
</script>
