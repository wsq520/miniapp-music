Component({
    properties: {
        itemData: {
            type: Object,
            value: {}
        },
        index: {
            type: Number,
            value: -1
        }
    },
    methods: {
        onSongItemTap() {
            const id = this.properties.itemData.id
            console.log(id)
            wx.navigateTo({
              url: `/pages/music-player/music-player?id=${id}`
            })
        }
    }
})