import { getTopMV } from '../../service/video'

Page({
    data: {
        videoList: [],
        offset: 0,
        hasMore: true
    },

    onLoad() {
     this.fetchTopMV()
    },

    async fetchTopMV() {
        const res = await getTopMV(this.data.offset)

        const newVideoList = [...this.data.videoList, ...res.data]

        this.setData({
            videoList: newVideoList
        })
        this.data.offset = this.data.videoList.length
        this.data.hasMore = res.hasMore
    },

    onReachBottom() {
        // console.log("底部");
        if(!this.data.hasMore) {
           return
        }
        this.fetchTopMV()
    },

    async onPullDownRefresh() {
        // console.log("上拉刷新");
        // 1.清空之前的数据
        this.setData({videoList: []})
        this.data.offset = 0
        this.data.hasMore = true

        await this.fetchTopMV()
        
         // 获取完数据后停止刷新状态
         wx.stopPullDownRefresh()
    },

    onVideoItemTap(event) {
        // console.log(event);
        // const item = event.currentTarget.dataset.item
        // console.log(item);
        // wx.navigateTo({
        //   url: `/pages/detail-video/detail-video?id=${item.id}`,
        // })
    }
})