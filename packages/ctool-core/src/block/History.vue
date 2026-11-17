<template>
    <Card :title="`${$t('main_history')} - ${$t('tool_' + storeOperate.items.tool)}`" height="100%" padding="0">
        <Table
            v-if="length > 0"
            :columns="[
                { title: $t('main_history_time'), key: 't', width: 170 },
                { title: $t('main_history_data'), key: 'v' },
            ]"
            action-width="130"
            :lists="lists"
        >
            <template #column="{ row }">
                <td class="p-2.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap">{{ row.t }}</td>
                <td class="p-2.5">
                    <Textarea :model-value="tableDataHandle(row.v)" height="80" />
                </td>
            </template>
            <template #default="{ row, index }">
                <div class="flex items-center justify-center gap-1.5 p-1">
                    <Button size="small" @click="() => view(row.v)">{{ $t("main_ui_views") }}</Button>
                    <Button size="small" type="primary" @click="() => load(index)">{{ $t("main_ui_load") }}</Button>
                </div>
            </template>
        </Table>
        <template v-else>
            <div class="w-full h-64 flex items-center justify-center">
                <Exception />
            </div>
        </template>
        <template #extra>
            <Button v-if="length > 0" size="small" type="danger" @click="clear">{{ $t("main_history_clear") }}</Button>
        </template>
    </Card>
    <Modal v-model="viewData.show" width="70%">
        <Textarea :model-value="JSON.stringify(viewData.data, null, '\t')" height="300" />
    </Modal>
</template>

<script setup lang="ts">
import useOperate from "@/store/operate";
import getHistoryInstance from "@/helper/history";
import event from "@/event";
import { instanceOfInput } from "@/helper/util";
import { isPlainObject, isString, isNumber } from "lodash";

const storeOperate = useOperate();

const lists = getHistoryInstance(storeOperate.items.tool, storeOperate.items.feature).all();
const length = getHistoryInstance(storeOperate.items.tool, storeOperate.items.feature).length();

const clear = () => {
    getHistoryInstance(storeOperate.items.tool, storeOperate.items.feature).clear();
    event.dispatch("extend_page_close");
};

const viewData = $ref({ show: false, data: {} });

const view = (item: any) => {
    viewData.data = item;
    viewData.show = true;
};

const load = (index: number = 0) => {
    storeOperate.redirectTool(storeOperate.items.tool, storeOperate.items.feature, storeOperate.items.category, index);
};

const tableDataHandle = (item: any) => {
    if (
        isPlainObject(item) &&
        "input" in item &&
        (JSON.stringify(item).length > 150 || Object.keys(item).length === 1)
    ) {
        const input = item.input;
        if (instanceOfInput(input)) {
            return input.value;
        }
        if (isString(input) || isNumber(input)) {
            return `${input}`;
        }
        return JSON.stringify(input);
    }
    return JSON.stringify(item);
};
</script>
