
Component({
    options: {
        multipleSlots: true
    },
    properties: {
        statusBarHeight: {
            type: Number,
            value: 20
        },
        title: {
            type: String,
            value: "导航标题"
        }
    },
    methods: {
        onLeftClick() {
            this.triggerEvent("leftclick")
        }
    }
})