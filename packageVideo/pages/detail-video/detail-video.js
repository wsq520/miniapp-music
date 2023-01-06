import { getMVUrl, getMVInfo, getMVRelate } from '../../../service/video'

Page({
    data: {
        id: 0,
        mvUrl: "",
        danmuList: [
            { text: "哈哈哈", color: "#ff0000", time: 3 },
            { text: "嘿嘿嘿", color: "#ff0000", time: 5 },
            { text: "啦啦啦", color: "#ff0000", time: 10 }
        ],
        mvInfo: {},
        relatedVideo: []
    },

    onLoad(options) {
        const id = options.id
        this.setData({
            id
        })

        this.fetchMVUrl()
        this.fetchMVInfo()
        this.fetchMVRelated()
    },

    async fetchMVUrl() {
      const res = await getMVUrl(this.data.id)
      this.setData({ mvUrl: res.data.url })
    },

    async fetchMVInfo() {
        const res = await getMVInfo(this.data.id)
        // console.log(res);
        this.setData({
            mvInfo: res.data
        })
    },

    async fetchMVRelated() {
        const res = await getMVRelate(this.data.id)
        // console.log(res);
        this.setData({
            relatedVideo: res.data
        })
    }
})