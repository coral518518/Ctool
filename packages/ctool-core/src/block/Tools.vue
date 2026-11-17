<template>
    <div class="flex flex-col gap-3.5 max-w-4xl mx-auto p-1 select-none">
        <!-- Common Tools -->
        <Card :title="$t('main_category_common')">
            <div class="flex flex-wrap gap-2 p-1">
                <Button
                    type="dotted"
                    :size="size"
                    @click="selectTool(name)"
                    v-for="name in setting.items.common"
                    :key="name"
                >
                    {{ $t(`tool_${name}`) }}
                </Button>
            </div>
            <template #extra>
                <Button type="primary" :text="$t('main_ui_setting')" @click="openCommon = true" size="small" />
            </template>
        </Card>

        <!-- Recently Used -->
        <Card :title="$t('main_recently_use')" v-if="recently.length > 0">
            <div class="flex flex-wrap gap-2 p-1">
                <Button
                    type="dotted"
                    :size="size"
                    @click="selectTool(item.tool.name, undefined, item.name)"
                    v-for="item in recently"
                    :key="`${item.tool.name}-${item.name}`"
                >
                    {{ `${$t(`tool_${item.tool.name}`)}${item.tool.isSimple() ? '' : ` - ${$t(`tool_${item.tool.name}_${item.name}`)}`}` }}
                </Button>
            </div>
        </Card>

        <!-- Tool Categories -->
        <Card :title="$t(`main_category_${cate.name}`)" v-for="cate in categories" :key="cate.name">
            <div class="flex flex-wrap gap-2 p-1">
                <template v-for="tool in cate.tools" :key="tool.name">
                    <Button
                        type="dotted"
                        :size="size"
                        @click="selectTool(tool.name, cate, item.name)"
                        v-for="item in tool.features"
                        :key="`${tool.name}-${item.name}`"
                    >
                        {{ `${$t(`tool_${item.tool.name}`)}${item.tool.isSimple() ? '' : ` - ${$t(`tool_${item.tool.name}_${item.name}`)}`}` }}
                    </Button>
                </template>
            </div>
        </Card>

        <ExtendPage v-model="openCommon" disable-replace>
            <Common />
        </ExtendPage>
    </div>
</template>

<script setup lang="ts">
import useOperate from "@/store/operate";
import useSetting from "@/store/setting";
import { categories, CategoryInterface, ToolType, FeatureInterface, FeatureType } from "@/config";
import Common from "./Common.vue";
import { ComponentSizeType } from "@/types";

const operate = useOperate();
const setting = useSetting();
let openCommon = $ref(false);

const size: ComponentSizeType = "default";

const selectTool = (tool: ToolType, category?: CategoryInterface, feature?: FeatureType) => {
    operate.redirectTool(tool, feature ? feature : operate.getToolLastFeature(tool), category ? category.name : "");
};

const recently: FeatureInterface[] = $computed(() => {
    return operate.getRecently().slice(0, 10);
});
</script>
