import Vue from 'vue'
import {
  Button,
  Swipe,
  SwipeItem,
  Lazyload,
  Form,
  Field,
  // Dialog
  // Tag,
  // CountDown,
  Tab,
  Tabs,
  // TreeSelect,
  // Card,
  // Divider,
  // NavBar,
  // Cell,
  // CellGroup,
  // rate,
  // Sku,
  // Popup, 再封装
  // Overlay,
  // Checkbox,
  // SwipeCell,
  // SubmitBar,
  // Stepper,
  Steps,
  Step,
  // Image,
  // ImagePreview,
  // Tabbar,
  // TabbarItem,
  // Search,
  // GoodsAction,
  // Loading,
  // Progress,
  // GoodsActionIcon,
  // GoodsActionButton,
  NoticeBar,
  // ActionSheet
} from 'vant'

// options 为可选参数，无则不传
Vue.use(Lazyload, { loading: require('@/assets/img/loading.svg') })
Vue.use(Button)
  // .use(Dialog)
  .use(Field)
  .use(Form)
  .use(Swipe)
  .use(SwipeItem)
  // .use(Tag)
  // .use(CountDown)
  .use(Tab)
  .use(Tabs)
  // .use(TreeSelect)
  // .use(Card)
  // .use(Divider)
  // .use(NavBar)
  // .use(Cell)
  // .use(CellGroup)
  // .use(rate)
  // .use(GoodsAction)
  // .use(GoodsActionIcon)
  // .use(GoodsActionButton)
  // .use(ActionSheet)
  // .use(Sku)
  // .use(Popup) 再封装
  // .use(Overlay)
  // .use(SwipeCell)
  // .use(Checkbox)
  // .use(SubmitBar)
  // .use(Stepper)
  .use(Steps)
  .use(Step)
  // .use(Image)
  // .use(ImagePreview)
  // .use(Tabbar)
  // .use(TabbarItem)
  // .use(Search)
  // .use(Progress)
  .use(NoticeBar)
  // .use(Loading)
