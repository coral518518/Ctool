<template>
    <div class="flex flex-col gap-3.5 max-w-4xl mx-auto p-1 select-none">
        <Card :title="$t('main_common_tool')">
            <Draggable v-model="selected" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-1.5" group="tool">
                <Button :type="'dotted'" v-for="name in selected" :key="name" long>
                    {{ $t(`tool_${name}`) }}
                </Button>
            </Draggable>
            <template #extra>
                <Button type="primary" size="small" @click="reset">{{ $t('main_ui_reset') }}</Button>
            </template>
        </Card>

        <Card :title="$t('main_unselected_tool')">
            <Draggable v-model="unselected" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-1.5" group="tool">
                <Button :type="'dotted'" v-for="name in unselected" :key="name" long>
                    {{ $t(`tool_${name}`) }}
                </Button>
            </Draggable>
            <template #extra>
                <span class="text-xs text-muted-foreground">{{ $t('main_common_drag') }}</span>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
import useSetting from "@/store/setting";
import { tools, ToolType } from "@/config";
import { watch } from "vue";
import { VueDraggableNext as Draggable } from "vue-draggable-next";

const storeSetting = useSetting();

let selected = $ref(storeSetting.items.common);

let unselected = $ref<ToolType[]>(
    tools
        .filter(item => {
            return !selected.includes(item.name);
        })
        .map(({ name }) => name),
);

watch(
    () => selected,
    value => {
        storeSetting.save("common", value);
    },
);

const reset = () => {
    storeSetting.save("common", []);
    selected = storeSetting.items.common;
    unselected = tools
        .filter(item => {
            return !selected.includes(item.name);
        })
        .map(({ name }) => name);
};
</script>
