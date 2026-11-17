<template>
    <main class="ctool-content w-full h-full p-1.5 overflow-hidden bg-background">
        <div class="ctool-main-tool w-full h-full">
            <router-view v-if="is" />
        </div>
    </main>
    <ExtendPage v-model="openSetting">
        <Setting />
    </ExtendPage>
    <Modal :title="$t('main_ui_prompt')" v-model="pwaUpdate" width="460">
        <div class="py-4 text-center text-sm font-medium text-foreground">
            {{ $t("main_new_version_found") }}
        </div>
        <template #footer>
            <Button type="primary" long @click="pwaUpdate = false; pwaUpdater?.()" :text="$t('main_ui_reload')" />
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { RouteMeta } from "@/types";
import { categoryExists, getTool } from "@/config";
import useOperate from "@/store/operate";
import event from "@/event";
import Setting from "@/block/Setting.vue";

const operate = useOperate();
const router = useRouter();
let pwaUpdate = $ref(false);
let pwaUpdater = $ref<(() => void) | null>(null);
let is = $ref(false);

onMounted(() => {
    window.dispatchEvent(new Event("resize"));
    window.addEventListener("ctool_service_worker_update", (event: any) => {
        pwaUpdate = true;
        pwaUpdater = event.detail.update;
    });
});

let openSetting = $ref(false);

event.addListener("open_setting", () => {
    openSetting = !openSetting;
});

router.beforeResolve(to => {
    is = false;
    const meta = to.meta as RouteMeta;
    if (meta.type === "tool") {
        const queryCategory = to.query.category?.toString() || "";
        const category = categoryExists(queryCategory) ? queryCategory : getTool(meta.tool).firstCategory().name;
        if (!operate.access(meta.tool, meta.feature, category)) {
            is = true;
            return false;
        }
    }
});

router.afterEach(() => {
    is = true;
});
</script>

<style>
.ctool-content {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.ctool-main-tool {
    width: 100%;
    height: 100%;
}
</style>
