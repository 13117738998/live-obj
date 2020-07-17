export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isShowMixin: {
      get () { return this.show },
      set (val) {
        this.$emit('update:show', val)
        if (!val) this.$emit('close')
      },
    },
  },
  methods: {
    resizeMixin  () {
      clearTimeout(this.$_resizeMixinTimer)
      this.$_resizeMixinTimer = setTimeout(() => {
        if (!this.$_evt) this.$_evt = new Event('resize')
        window.dispatchEvent(this.$_evt)
      }, 50)
    },
  },
}
