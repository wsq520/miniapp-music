Component({
    properties: {
        title: {
            type: String,
            value: "默认标题"
        },
        hasMore: {
            type: Boolean,
            value: true
        }
    },
    methods: {
        onMoreTap() {
            // 给父组件发送事件
            this.triggerEvent("moreclick")
        }
    }
})