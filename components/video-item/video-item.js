Component({
    properties: {
        itemData: {
            type: Object,
            value: {}
        }
    },
    methods: {
        onItemtap() {
            const item = this.properties.itemData
            wx.navigateTo({
                url: `/pages/detail-video/detail-video?id=${item.id}`,
            })
        }
    }
})