<script setup lang="ts">
import {inject, ref} from "vue";
import {AxiosInstance} from "axios";
import {useUserStore} from "@/store/useUserStore.ts";
import {todoGroup, user_joinedGroupsResponse} from "@/types";
import {Message} from "@arco-design/web-vue";
import "@arco-design/web-vue/es/message/style/index.css"
import router from "@/router";

let serverAxios = inject('serverAxios') as AxiosInstance;
let groupDetails = ref<todoGroup[]>([])
let ownerDetails = ref({})
let dataLoading = ref(true);
let modalVisible = ref(false)
let addToGroupId = ref('')
let createGroupForm = ref({
  open: false,
  name: "",
  brief: '',
  loading: false,
})
function createGroup() {
  createGroupForm.value.loading = true;
  serverAxios.post('/api/group/create', {
    name: createGroupForm.value.name,
    brief: createGroupForm.value.brief,
  }).then((res: any) => {
    if (res.data.code === 200) {
      Message.info(`创建成功, id为${res.data.data}`)
    }
  }).finally(() => createGroupForm.value.loading = false)
}
function refreshGroups() {
  dataLoading.value = true;
  serverAxios.post('/api/user/joinedGroups', {token: useUserStore().token}).then((res) => {
    if (res.data.code === 200) {
      let groupIds = (res.data.data as user_joinedGroupsResponse).map((g) => g.id);
      serverAxios.post('/api/groups/basicInfos', {token: useUserStore().token, groups: groupIds}).then((res) => {
        if (res.data.code === 200) {
          let tmpGroupDetails = <todoGroup[]>[]
          for (let key in res.data.data) {
            tmpGroupDetails.push({
              id: key,
              ...res.data.data[key],
            })
          }
          serverAxios.post('/api/users/basicInfos', {token: useUserStore().token, accounts: tmpGroupDetails.map(gd => gd.owner)}).then((res) => {
            console.log('$basicInfos u', res.data)
            if (res.data.code === 200) {
              ownerDetails.value = res.data.data
              groupDetails.value = tmpGroupDetails
              dataLoading.value = false;
            }
          })
        }
        console.log('$groupDetails', groupDetails.value)
      })
    }
  })
}
refreshGroups();

function tmp_joinGroup() {
  let tmp = prompt("输入组id");
  if (tmp) {
    serverAxios.post('/api/user/join/group', {token: useUserStore().token, id: parseInt(tmp)}).then((res) => {
      console.log(res)
      if (res.data.code === 200) {
        Message.success('加入成功！')
      }
    })
  }
}

function copyGroupId(s: number) {
  navigator.clipboard.writeText(s.toString()).then(() => {
    Message.info(`复制成功, id为${s}`)
  })
}

function redirect(pathName: string, query: Record<string, string> = {}) {
  router.push({
    name: pathName,
    query: query
  })
}

function publishTask() {
  if (!addToGroupId.value) {
    Message.error('组ID出错')
    modalVisible.value = false
  }else {
    modalVisible.value=false
    redirect("addTask", {
      GROUP: addToGroupId.value,
    })
  }
}

</script>

<template>
  <div class="groupPageContainer">
    <a-modal
        :visible="modalVisible"
        @cancel="modalVisible = false"
        :unmount-on-close="true"
        @ok="publishTask()"
    >
      <template #title>请选择要发布到哪一组</template>
      <a-select v-model="addToGroupId" :default-value="groupDetails.length ? groupDetails[0].id.toString() : ''">
        <a-option :value="g.id.toString()" v-for="g in groupDetails">{{g.name}} ({{g.id}})</a-option>
      </a-select>
    </a-modal>
    <a-drawer @cancel="createGroupForm.open = false" :visible="createGroupForm.open" placement="bottom">
<!--      <a-space direction="vertical">-->
        <a-input v-model="createGroupForm.name" placeholder="输入组昵称" style="margin-bottom: 5px"/>
        <a-textarea v-model="createGroupForm.brief" placeholder="输入组简介" />
        <a-button @click="createGroup" :loading="createGroupForm.loading">创建</a-button>
<!--      </a-space>-->
    </a-drawer>
    <div class="function">
      <a-typography-title>操作</a-typography-title>
      <a-space>
        <a-button :loading="dataLoading" @click="tmp_joinGroup" type="primary">加入团队</a-button>
        <a-button :loading="dataLoading" @click="createGroupForm.open = !createGroupForm.open" type="primary">创建团队</a-button>
        <a-button @click="refreshGroups" :loading="dataLoading">刷新</a-button>
        <a-button @click="modalVisible = true" :loading="dataLoading" type="primary">发布任务</a-button>
      </a-space>
    </div>
    <div class="joined">
      <a-typography-title>已加入</a-typography-title>
      <a-spin style="width: 100%;" :loading="dataLoading" tip="加载中...">
        <a-empty v-show="groupDetails.length === 0">
          暂未加入任何团队 / 数据获取中
        </a-empty>
        <a-grid :cols="{xs: 1, sm:1, md: 1, lg:2, xl: 2, xxl: 3}" :col-gap="12" :row-gap="16" class="grid-group">
          <a-grid-item v-for="group in groupDetails" :key="group.id">
            <a-card :title="group.name" hoverable>
              <template #extra>
                <a-link @click="copyGroupId(group.id)">复制id</a-link>
              </template>
              <a-card-meta :description="group.brief">
                <template #avatar>
                  <div
                      :style="{ display: 'flex', alignItems: 'center'}"
                  >
                    <a-avatar :image-url="ownerDetails[group.owner].avatar" class="forbidSelect" :size="24" style="margin-right: 8px" >
                      <span v-if="!ownerDetails[group.owner].avatar">{{ ownerDetails[group.owner].nickname.substring(0, 1) }}</span>
                    </a-avatar>
                    <a-typography-text class="px22px">{{ownerDetails[group.owner].nickname}}</a-typography-text>
                  </div>
                </template>
              </a-card-meta>
            </a-card>
          </a-grid-item>
        </a-grid>
      </a-spin>
    </div>
  </div>
</template>

<style scoped>
.groupPageContainer {
  padding: 0 20px;
}
.px22px {
  height: 24px;
  line-height: 24px;
}
</style>