import recommendStore from '../../store/recommendStore'
import rankingStore from '../../store/rankingStore'

import { getPlaylistDetail } from '../../service/music'
import playerStore from '../../store/playerStore'

Page({
    data: {
        songs: [],
        id: 0,
        type: "ranking",
        key: "newRanking",
        songInfo: {}
    },
    onLoad(options) {
        const type = options.type
        this.setData({ type })
        if(type === "ranking") {
            const key = options.key
            this.data.key = key
            rankingStore.onState(key, this.handleRanking)
        } else if(type === "recommend"){
            recommendStore.onState("recommendSongInfo", this.handleRanking)
        } else if (type === "menu") {
            const id = options.id
            this.data.id = id
            this.fetchMenuSongInfo()
        }
    },
    handleRecommendSongs(value) {
        this.setData({
            songs: value
        })
    },

    async fetchMenuSongInfo() {
       const res = await getPlaylistDetail(this.data.id)
        this.setData({ songInfo: res.playlist })
    },

    onSongItemTap() {
        playerStore.setState("playSongList", this.data.songInfo.tracks)
    },

    handleRanking(value) {
        if(this.data.type === "recommend") {
            value.name = "推荐歌曲"
        }
        this.setData( { songInfo: value })
        wx.setNavigationBarTitle({
          title: value.name
        })
    },

    onUnload() {
        if(this.data.type === "ranking") {
            rankingStore.onState(this.data.key, this.handleRanking)
        } else if (this.data.type === "recommend") {
            recommendStore.offState("recommendSongInfo", this.handleRanking)
        }
    }
})