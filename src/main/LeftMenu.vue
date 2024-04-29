<template>
  <Menu :theme=menuTheme
        width="auto"
        accordion
        :class="menuitemClasses"
        @on-open-change="twoMenu"
        :active-name="activeName"
        :open-names="openActiveName"
        ref="menu">
    <!--    <div v-for="(item,index) in navListItem" :key="index">-->
    <!--      <Submenu v-if="item.subItem != undefined" :name="item.name">-->
    <!--        <template slot="title" style="background: #5cadff;">-->
    <!--          {{item.name}}-->
    <!--        </template>-->
    <!--        <Menu-item @click.native="clickMenu(name,sub.url)" v-for="sub in item.subItem" :name="sub.url" :key="sub.id">-->
    <!--          {{sub.name}}-->
    <!--        </Menu-item>-->
    <!--      </Submenu>-->
    <!--      <MenuItem v-else @click.native="clickMenu(item.name,item.url)" :name="item.url" :key="item.id" :id="item.id">-->
    <!--        {{item.name}}-->
    <!--      </MenuItem>-->
    <!--    </div>-->
    <div v-for="(item,index) in navListItem" :key="index">
      <Menu-item :name="item.url" v-if="item.name == '首页'" @click.native="clickMenu(item.name,item.url)">
        {{item.name}}
      </Menu-item>

      <Submenu v-if="item.name != '首页'" :name="item.url">
        <template slot="title" style="background: #5cadff;">
          {{item.name}}
        </template>

        <div v-for="(sub,index) in item.firstLayerNav" :key="index">
          <div class="divider" v-if="index==0 && menuTheme!='dark'"></div>
          <Submenu v-if="sub.subItem != undefined" :name="sub.url">
            <template slot="title">
              {{sub.name}}
            </template>
            <div v-if="sub.subItem != undefined" v-for="(small,index) in sub.subItem">
              <div class="divider" v-if="index==0 && menuTheme!='dark'"></div>
              <Menu-item
                :name="small.url" :key="index"
                @click.native="clickMenu(small.name,small.url)">
                {{small.name}}
                <Badge :count="sub.count" v-if="sub.count!=undefined && sub.count>0" style="height: 20px"></Badge>
              </Menu-item>
              <div class="divider" v-if="index<(sub.subItem.length-1) && menuTheme!='dark'"></div>
            </div>

          </Submenu>

          <Menu-item
            v-else
            :name="sub.url"
            @click.native="clickMenu(sub.name,sub.url)">
            {{sub.name}}
            <Badge :count="sub.count" v-if="sub.count!=undefined && sub.count>0" style="height: 20px"></Badge>
          </Menu-item>

          <div class="divider" v-if="index<(item.firstLayerNav.length-1) && menuTheme!='dark'"></div>
        </div>

      </Submenu>
      <div class="divider" v-if="menuTheme!='dark'"></div>
    </div>
  </Menu>
</template>

<script>


  export default {
    data() {
      return {
        // menuItmes:[]
        dataFirst: [],
        tableFirst:[],
        e:0,
        activeName:'',
        openActiveName:[],
        name:this.$store.getters.openLeftMenuItem,
        menuTheme:'light',
      }
    },
    // props: ['menuItmes', 'navId', 'isCollapsed'],
    methods: {
      clickMenu(name,id) {

        if(name == '首页'){
          this.openActiveName = [];
          this.$nextTick(()=>{
            this.$refs.menu.updateOpened()
            this.$refs.menu.updateActiveName()
          })

          this.activeName = id;
          this.$store.commit('openLeftMenuItem',this.openActiveName)
          this.$store.commit('leftMenu',id)
        }else{
          this.openActiveName = [];
          const x = this.$store.getters.openLeftMenuItem;
          x.push(id)
          this.$store.commit('openLeftMenuItem',x)
          this.activeName = id;
          this.name = this.$store.getters.openLeftMenuItem;
          this.$store.commit('leftMenu',id);
          let topNav=this.$store.getters.topNav;
          let menu=this.$store.getters.leftMenu;

        }
        this.$router.push({
          name: id
        });
      },
      twoMenu(name){
        this.name = name.toString();
        this.$store.commit('openLeftMenuItem',name)
        // this.openActiveName.push(name);
        // this.name = name;
        // if(name[0] != '住宿信息'){
        //   return;
        // }
        // if(name.length==0){
        //   return;
        // }
        // if(name.length==2){
        //   this.threeMenu(name[1])
        //   return;
        // }

      },
      threeMenu(id){
        this.$load.show();
        this.openActiveName = this.name;
        this.$store.commit('openLeftMenuItem',this.name)
        this.$fetch(this.$api.apartment.HouseTableFirst, {
          userId: this.$util.getSession("token").userId,
          collegeId: this.$util.getSession('user').collegeId,
          tokenId: this.$util.getSession('token').tokenId,
          areaId: id
        })
          .then((res) => {
            this.$load.hide();
            if (res.code != 200) {
              this.$Message.error(res.message);
              return;
            }
            this.tableFirst = res.body;
          })
          .catch((err) => {
            this.$Message.error(err.message);
            this.$load.hide();
          })
      },
      leftMenuAn(){
        if(this.$store.getters.openLeftMenuItem != null){
          if(this.$store.getters.openLeftMenuItem.subItem == undefined){
            this.openActiveName = this.$store.getters.openLeftMenuItem;
          }else{
            this.openActiveName = this.$store.getters.openLeftMenuItem[0];
          }
          this.activeName = this.$store.getters.leftMenu
          this.$nextTick(()=>{
            this.$refs.menu.updateOpened()
            this.$refs.menu.updateActiveName()
          })
        }
      }
    },
    computed: {
      menuitemClasses() {
        return [
          'menu-item', this.isCollapsed ? 'collapsed-menu' : ''
        ]
      },
      navListItem(){
        return this.$store.getters.navListItem
      }
    },
    mounted() {
      this.leftMenuAn();
      // this.menuTheme=this.$util.getLocal('college')=='2512'?'dark':'light'
      document.getElementsByClassName('ivu-layout-sider-children')[0].style.background=this.$util.getLocal('college')=='2512'?'#021D38':'#fff'
      document.getElementsByClassName('ivu-card')[0].style.borderRadius=this.$util.getLocal('college')=='2512'?'0px':'4px'
      document.getElementsByClassName('mainCss')[0].style.borderColor=this.$util.getLocal('college')=='2512'?'#021D38':'#fff'
      document.getElementsByClassName('mainCss')[0].style.borderRadius=this.$util.getLocal('college')=='2512'?'0px':'4px'

      // this.menuTheme='dark'
      // // document.getElementsByClassName('ivu-layout-sider-children')[0].style.background='#021D38'
      // document.getElementsByClassName('ivu-card')[0].style.borderRadius='0px'
      // // document.getElementsByClassName('mainCss')[0].style.borderColor='#021D38'
      // document.getElementsByClassName('mainCss')[0].style.borderRadius='0px'
    }
  }
</script>

<style scoped lang="less">
  .ivu-menu-vertical.ivu-menu-light:after {
    background: none;
  }
  .ivu-badge {
    position: relative;
    display: inline-block;
    top: -8px;
    right: 5px;
  }
  .divider{
    width: 100%;
    height: 1px;
    background: #eeeeee;
  }
</style>
