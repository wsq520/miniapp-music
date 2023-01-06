Component({
    properties: {
        itemData: {
            type: Object,
            value: {}
        }
    },
    methods: {
        onSongItemTap() {
            const id = this.properties.itemData.id
            console.log(id)
            wx.navigateTo({
              url: `/packagePlayer/pages/music-player/music-player?id=${id}`
            })
        }
    }
})