<template>
  <el-icon class="settings-button" @click="onOpen">
    <Setting/>
  </el-icon>

  <el-dialog
    v-model="dialogVisible"
    width="700"
    :before-close="onClose"
  >
    <template #header>
      <span style="font-size: 24px">设置</span>
      <el-divider/>
    </template>

    <template #default>
      <el-row>
        <el-col :span="6">
          <el-menu default-active="/settings/general" router>
            <el-menu-item index="/settings/general">
              <el-icon><Setting/></el-icon>
              <span class="menu-text">通用设置</span>
            </el-menu-item>
          </el-menu>
        </el-col>

        <el-col :span="17" :offset="1">
          <router-view></router-view>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue';
import { ref } from "vue";
import { useRouter } from "vue-router";

const dialogVisible = ref(false)

function onClose(done: () => void) {
  done()
}

const router = useRouter()

function onOpen() {
  dialogVisible.value = true
  router.push('/settings/general')
}

</script>

<style scoped>
.settings-button {
  position: absolute;
  top: 25px;
  right: 25px;
  z-index: 999;
  cursor: pointer;
  font-size: 30px;
}

.menu-text {
  font-size: 18px;
}
</style>
