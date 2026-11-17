<template>
    <Card :title="$t('main_ui_setting')" height="100%" padding="16px 20px">
        <template #extra>
            <span class="text-[11px] font-mono text-muted-foreground">
                Ctool v{{ version }} &middot; {{ $t('main_last_updated') }}{{ lastUpdate }}
            </span>
        </template>

        <div class="max-w-2xl mx-auto space-y-4 text-xs select-none">
            <!-- Appearance & Display -->
            <div class="rounded-lg border border-border/70 bg-card p-3.5 space-y-3 shadow-xs">
                <div class="text-xs font-semibold text-foreground tracking-tight pb-1 border-b border-border/50">
                    {{ $t('main_display_mode') }} / {{ $t('main_setting_layout') }}
                </div>

                <div class="flex items-center justify-between gap-4">
                    <div class="flex flex-col">
                        <span class="font-medium text-foreground">{{ $t('main_display_mode') }}</span>
                        <span class="text-[11px] text-muted-foreground">跟随系统或手动指定深浅模式</span>
                    </div>
                    <Select
                        :model-value="storeSetting.items.theme"
                        @change="(value) => storeSetting.save('theme', value as any)"
                        :options="themes.map((item) => ({ value: item, label: $t('main_display_mode_' + item) }))"
                        width="140"
                    />
                </div>

                <div class="flex items-center justify-between gap-4">
                    <div class="flex flex-col">
                        <span class="font-medium text-foreground">{{ $t('main_setting_language') }}</span>
                        <span class="text-[11px] text-muted-foreground">界面语言环境</span>
                    </div>
                    <Select
                        :model-value="storeSetting.items.locale"
                        @change="(value) => storeSetting.save('locale', value as any)"
                        :options="localeOptions"
                        width="140"
                    />
                </div>

                <div class="flex items-center justify-between gap-4">
                    <div class="flex flex-col">
                        <span class="font-medium text-foreground">{{ $t('main_setting_layout') }}</span>
                        <span class="text-[11px] text-muted-foreground">导航栏风格模式（极简 / 紧凑分类）</span>
                    </div>
                    <Select
                        :model-value="storeSetting.items.layout"
                        @change="(value) => storeSetting.save('layout', value as any)"
                        :options="['complex', 'simple'].map((item) => ({ value: item, label: $t('main_setting_layout_' + item) }))"
                        width="140"
                    />
                </div>
            </div>

            <!-- Clipboard Automation -->
            <div class="rounded-lg border border-border/70 bg-card p-3.5 space-y-3 shadow-xs">
                <div class="text-xs font-semibold text-foreground tracking-tight pb-1 border-b border-border/50">
                    {{ $t('main_ui_clipboard') }}
                </div>

                <div class="flex items-center justify-between gap-4">
                    <div class="flex flex-col">
                        <span class="font-medium text-foreground">{{ $t('main_copy_results_to_clipboard') }}</span>
                        <span class="text-[11px] text-muted-foreground">转换或生成结果后自动复制到剪贴板</span>
                    </div>
                    <Bool
                        :model-value="storeSetting.items.auto_save_copy"
                        @change="(value) => storeSetting.save('auto_save_copy', value)"
                    />
                </div>

                <div class="flex items-center justify-between gap-4">
                    <div class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <span class="font-medium text-foreground">{{ $t('main_read_content_from_clipboard') }}</span>
                            <Link
                                v-if="clipboardState === 'prompt'"
                                style="font-size: 0.75rem"
                                type="primary"
                                href="/tool.html#/clipboard"
                            >
                                {{ $t('main_clipboard_get') }}
                            </Link>
                        </div>
                        <span class="text-[11px] text-muted-foreground">打开工具时自动从剪贴板读取数据填入</span>
                    </div>
                    <Bool
                        :disabled="clipboardState !== 'granted'"
                        :model-value="storeSetting.items.auto_read_copy"
                        @change="(value) => storeSetting.save('auto_read_copy', value)"
                    />
                </div>

                <div class="flex items-center justify-between gap-4">
                    <div class="flex flex-col">
                        <span class="font-medium text-foreground">{{ $t('main_read_clipboard_content_trim') }}</span>
                        <span class="text-[11px] text-muted-foreground">读取剪贴板内容时自动过滤首尾不可见字符</span>
                    </div>
                    <Bool
                        :disabled="!storeSetting.items.auto_read_copy"
                        :model-value="storeSetting.items.auto_read_copy_filter"
                        @change="(value) => storeSetting.save('auto_read_copy_filter', value)"
                    />
                </div>
            </div>

            <!-- Other Preferences -->
            <div class="rounded-lg border border-border/70 bg-card p-3.5 space-y-3 shadow-xs">
                <div class="text-xs font-semibold text-foreground tracking-tight pb-1 border-b border-border/50">
                    {{ $t('main_ui_other') }}
                </div>

                <div class="flex items-center justify-between gap-4">
                    <div class="flex flex-col">
                        <span class="font-medium text-foreground">{{ $t('main_auto_fill') }}</span>
                        <span class="text-[11px] text-muted-foreground">{{ $t('main_auto_fill_explain', [storeSetting.items.fill_history_expire]) }}</span>
                    </div>
                    <InputNumber
                        :model-value="storeSetting.items.fill_history_expire"
                        :width="120"
                        @change="(value) => storeSetting.save('fill_history_expire', value)"
                    />
                </div>

                <div class="flex items-center justify-between gap-4">
                    <div class="flex flex-col">
                        <span class="font-medium text-foreground">{{ $t('main_common_tool') }}</span>
                        <span class="text-[11px] text-muted-foreground">自定义底部或快捷区常用工具排序</span>
                    </div>
                    <Button :size="'small'" @click="openCommon = !openCommon" :text="`${$t('main_ui_config')}`" />
                </div>

                <div class="flex items-center justify-between gap-4">
                    <div class="flex flex-col">
                        <span class="font-medium text-foreground">{{ $t('main_history_icon_badge_hidden') }}</span>
                        <span class="text-[11px] text-muted-foreground">隐藏历史记录的小红点角标提醒</span>
                    </div>
                    <Bool
                        :model-value="storeSetting.items.history_icon_badge_hidden"
                        @change="(value) => storeSetting.save('history_icon_badge_hidden', value)"
                    />
                </div>

                <div v-if="platform.isChromium()" class="flex items-center justify-between gap-4 pt-1 border-t border-border/40">
                    <span class="font-medium text-foreground">{{ $t('main_keyboard_setting') }}</span>
                    <Link href="chrome://extensions/shortcuts" class="text-primary font-mono text-xs">chrome://extensions/shortcuts</Link>
                </div>
            </div>
        </div>
    </Card>

    <ExtendPage v-model="openCommon" disable-replace>
        <Common />
    </ExtendPage>
</template>

<script setup lang="ts">
import useSetting from "@/store/setting";
import { useClipboardPermission } from "@/helper/clipboard";
import { locales, themes } from "@/types";
import platform from "@/helper/platform";
import { getLocaleName } from "@/i18n";
import Common from "./Common.vue";
import { version, buildTimestamp } from "@/helper/util";
import dayjs from "dayjs";
import Bool from "@/components/ui/Bool.vue";
import Link from "@/components/ui/Link.vue";
import Button from "@/components/ui/Button.vue";
import InputNumber from "@/components/ui/InputNumber.vue";
import Select from "@/components/ui/Select.vue";

const storeSetting = useSetting();
let openCommon = $ref(false);

const lastUpdate = dayjs.unix(buildTimestamp).format("YYYY-MM-DD HH:mm:ss");

const localeOptions = locales.map(item => {
    return { value: item, label: getLocaleName(item) || "" };
});

const { state: clipboardState } = useClipboardPermission();
</script>
