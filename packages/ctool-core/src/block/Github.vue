<template>
    <div class="ctool-github inline-flex items-center rounded-md border border-border/80 bg-muted/30 text-xs font-medium transition-colors shadow-2xs select-none">
        <span
            class="ctool-github-name px-2 py-0.5 flex items-center gap-1.5 cursor-pointer text-foreground hover:text-primary transition-colors"
            @click="openUrl('https://ctool.coral.cc.cd/')"
        >
            <Icon name="github" :size="12" />
            <strong class="font-bold tracking-tight">Ctool</strong>
        </span>
        <span
            v-if="star > 0"
            class="ctool-github-star px-1.5 py-0.5 border-l border-border/70 flex items-center gap-1 cursor-pointer bg-muted/60 text-muted-foreground hover:text-foreground font-mono text-[11px] transition-colors"
            @click="openUrl('https://github.com/coral518518/Ctool')"
        >
            <Star :size="10" class="text-amber-500 fill-amber-500" />
            <span>{{ `${star}`.replace(/(\d)(?=(\d{3})+$)/g, "$1,") }}</span>
        </span>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import axios from "axios";
import storage from "@/helper/storage";
import { openUrl } from "@/helper/helper";
import { Star } from "lucide-vue-next";

const CACHE_NAME = "github_star";

let star = $ref(storage.get<number>(CACHE_NAME) || 0);

onMounted(() => {
    if (star === 0) {
        axios({ url: "https://api.github.com/repos/coral518518/Ctool" })
            .then(({ data }) => {
                const count = data.stargazers_count ? parseInt(data.stargazers_count) : 0;
                if (count > 0) {
                    star = count;
                    storage.setNoVersion(CACHE_NAME, count, 3700);
                }
            })
            .catch(() => {});
    }
});
</script>
