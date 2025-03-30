<template>
  <el-col :span="6">
    <div class="info">
      <span>版本号: V1.1.1</span>
      <br>
      <span>联系作者: </span>
      <el-popover
        trigger="hover"
        content="通过 yifeng.zhao@alstomgroup.com 联系作者"
        placement="top"
        :width="300">
        <template #reference>
          <a href="mailto:yifeng.zhao@alstomgroup.com">三一居士</a>
        </template>
      </el-popover>
    </div>
  </el-col>
</template>

<script setup lang="ts">
import {ElCol, ElPopover} from "element-plus";

</script>

<style scoped>

</style>
