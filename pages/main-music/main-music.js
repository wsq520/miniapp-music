import { getMusicBanner, 
         getPlaylistDetail, 
         getSongMenuList } 
from '../../service/music'
import { querySelect } from '../../utils/query-select'
// import mythrottle from '../../utils/throttle'
import { throttle } from 'underscore'

import recommendStore from '../../store/recommendStore'
import rankingStore from '../../store/rankingStore'
import playerStore from '../../store/playerStore'

const querySelectThrottle = throttle(querySelect)
const app = getApp()

Page({
    data: {
        searchValue: "",
        banners: [],
        bannerHeight: 0,
        screenWidth: 375,
        recommendSongs: [],
        // 歌单数据
        hotMenuList: [],
        recommendMenuList: [],
        // 巅峰榜数据
        isRankingData: false,
        rankingInfos: {},
        // 当前正在播放的歌曲信息
        currentSong: {},
        isPlaying: false
    },

    onLoad() {
        this.fetchMusicBanner()
        //this.fetchRecommendSongs()
        this.fetchSongMenuList()

        recommendStore.onState("recommendSongInfo", this.handleRecommendSongs)
        // 发起actions
        recommendStore.dispatch("fetchRecommendSongsAction")

        rankingStore.onState("newRanking", this.handleNewRanking)
        rankingStore.onState("originRanking", this.handleOriginRanking)
        rankingStore.onState("upRanking", this.handleUpRanking)
        rankingStore.dispatch("fetchRankingDataAction")

        playerStore.onStates(["currentSong", "isPlaying"], this.handlePlayInfos)

        // 获取设备的尺寸
        this.setData({ screenWidth: app.globalData.screenWidth })
    },

    async fetchMusicBanner() {
        const res = await getMusicBanner()
        this.setData({
            banners: res.banners
        })
    },

    async fetchRecommendSongs() {
        const res = await getPlaylistDetail(3778678)
        const playlist = res.playlist
        const recommendSongs = playlist.tracks.slice(0, 6)
        this.setData({
            recommendSongs
        })
    },

    async fetchSongMenuList() {
        getSongMenuList().then(res => {
            this.setData({
                hotMenuList: res.playlists
            })
        })
        getSongMenuList("华语").then(res => {
            this.setData({
                recommendMenuList: res.playlists
            })
        })
    },

    onSearchClick() {
        wx.navigateTo({
          url: '/pages/detail-search/detail-search',
        })
    },

    onBannerImageLoad(event) {
        // console.log(event);
        // 获取image组件的高度
        querySelectThrottle(".banner-image").then(res => {
           console.log(res);
           this.setData( {bannerHeight: res[0].height} )
       }).catch(err => {
           console.log("轮播图数据异常")
       })
    },

    onRecommendMoreClick() {
        wx.navigateTo({
          url: '/pages/detail-song/detail-song?type=recommend',
        })
    },

    onSongItemTap(event) {
        const index = event.currentTarget.dataset.index
        playerStore.setState("playSongList", this.data.recommendMenuList)
        playerStore.setState("playSongIndex", index)
    },

    onPlayOrPauseBtnTap() {
        playerStore.dispatch("changeMusicStatusAction")
    },

    onPlayerAlbumTap() {
        wx.navigateTo({
          url: '/pages/music-player/music-player',
        })
    },

    // 从store中获取数据
    handleRecommendSongs(value) {
       if(value.tracks) {
        this.setData({
            recommendSongs: value.tracks.slice(0, 6)
        })
       }
    },
    handleNewRanking(value) {
        if(!value.name) return
        this.setData({isRankingData: true})
        const newRankingInfos = {
            ...this.data.rankingInfos, 
            newRanking: value,
        }
        this.setData({ rankingInfos: newRankingInfos })
    },
    handleOriginRanking(value) {
        if(!value.name) return
        this.setData({isRankingData: true})
        const newRankingInfos = {...this.data.rankingInfos, originRanking: value}
        this.setData({ rankingInfos: newRankingInfos })
    },
    handleUpRanking(value) {
        if(!value.name) return
        this.setData({isRankingData: true})
        const newRankingInfos = {...this.data.rankingInfos, upRanking: value}
        this.setData({ rankingInfos: newRankingInfos })
    },
    handlePlayInfos({ currentSong,  isPlaying }) {
        if(currentSong) {
            this.setData({ currentSong })
        }
        if (isPlaying !== undefined) {
            this.setData({ isPlaying })
        }
    },

    onUnload() {
        recommendStore.offState("recommendSongs", this.handleRecommendSongs)
        recommendStore.offState("newRanking", this.handleNewRanking)
        recommendStore.offState("originRanking", this.handleOriginRanking)
        recommendStore.offState("upRanking", this.handleUpRanking)
        playerStore.offStates(["currentSong", "isPlaying"], this.handlePlayInfos)
    }
})