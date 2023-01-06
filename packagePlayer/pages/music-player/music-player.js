import { throttle } from 'underscore'
import playerStore, { audioContext  } from '../../../store/playerStore'

const app = getApp()

const modeNames = ["order", "repeat", "random"]

Page({
    data: {
        stateKeys: ["id", "currentSong", "durationTime", "currentTime", "lyricInfos", "currentLyricText", "currentLyricIndex", "isPlaying",
        "playModeIndex"],

        id: 0,
        currentSong: {},
        lyricInfos: [],
        currentLyricText: "",
        currentLyricIndex: -1,

        statusBarHeight: 20,

        pageTitles: ["歌曲", "歌词"],
        currentPage: 0,
        contentHeight: 500,

        currentTime: 0,
        durationTime: 0,
        sliderValue: 0,
        isSliderChanging: false,
        isWaiting: false,
        isPlaying: true,
        isFirstPlay: true,

        lyricScorllTop: 0,

        playSongIndex: 0,
        playSongList: [],

        // 0:顺序播放 1：单曲循环 2：随机播放
        playModeName: "order"
    },
    onLoad(options) {
        this.setData({ 
            statusBarHeight: app.globalData.statusBarHeight,
            contentHeight: app.globalData.contentHeight
         })
        
        // 获取传入的id
        const id = options.id
        
        if(id) {
            // 播放歌曲
            playerStore.dispatch("playMusicWithSongIdAction", id)
        }
      
        // store监听数据
        playerStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
        playerStore.onStates(this.data.stateKeys, this. getPlayerInfosHandler)
    },
    onSwiperChange(event) {
        // console.log(event.detail.current)
        this.setData({ currentPage: event.detail.current })
    },
    onNavTabItemTap(event) {
        const index = event.currentTarget.dataset.index
        // console.log(index);
        this.setData({currentPage: index})
    },
    onSliderChange(event) {
        this.data.isWaiting = true
        setTimeout(() => {
            this.data.isWaiting = false
        }, 1500)
        // 1.获取点击滑块位置对应的值
        const value = event.detail.value
        // 2.计算出要播放的位置时间
        const currentTime = value / 100 * this.data.durationTime
        // 3.设置播放器
        audioContext.seek(currentTime / 1000)
        this.setData({ 
            currentTime, 
            isSliderChanging: false, 
            sliderValue: value 
        }) 
    },

    // 节流:避免进度条频繁拖动导致函数频繁执行
    onSliderChangeing: throttle(function(event) {
        const value = event.detail.value
        const currentTime = value / 100 * this.data.durationTime
        this.setData({ currentTime }) 
        this.data.isSliderChanging = true
    }, 100),

    // 更新进度条
    updateProgress: throttle(function(currentTime) {
        // 如果正在滑动进度条 先不更新进度条
        if(this.data.isSliderChanging) return
    
       // 修改滑块的值 改变进度条
       const sliderValue = currentTime / this.data.durationTime * 100
       // 记录当前时间
       this.setData({
           currentTime,
           sliderValue
       }) 
    }, 800, { leading: false, trailing: false }),

    onModeBtnTap() {
       playerStore.dispatch("changePlayModeAction")
    },

    // 点击左上角箭头返回上一个页面
    onNavBackTap() {
        wx.navigateBack()
    },

    // 控制播放或暂停
    onPlayOrPauseTap() {
       playerStore.dispatch("changeMusicStatusAction")
    },
    // 上一首
    onPrevBtnTap() {
       console.log("上一首");
       playerStore.dispatch("playNewMusicAction", false)
    },
    // 下一首
    onNextBtnTap() {
      console.log("下一首");
      playerStore.dispatch("playNewMusicAction", true)
    },

    changeNewSong(isNext = true) {
       
    },

    // store
    getPlaySongInfosHandler({playSongList, playSongIndex}) {
        // console.log(value)
        if(playSongList) {
            this.setData({ playSongList})
        }
        if(playSongIndex !== undefined) {
            this.setData({ playSongIndex })
        }
    },
    getPlayerInfosHandler({
        id, currentSong, durationTime, currentTime, lyricInfos, currentLyricText, currentLyricIndex, isPlaying, playModeIndex
    }) {
        if (id !== undefined) {
            this.setData({ id })
        }
        if (currentSong) {
            this.setData({ currentSong })
        }
        if (durationTime !== undefined) {
            this.setData({ durationTime })
        }
        if (currentTime !== undefined) {
            this.updateProgress(currentTime)
        }
        if (lyricInfos) {
            this.setData({ lyricInfos })
        }
        if (currentLyricText) {
            this.setData({ currentLyricText })
        }
        if (currentLyricIndex !== undefined) {
            this.setData({ 
                currentLyricIndex,   
                lyricScorllTop: currentLyricIndex * 35 
            })
        }
        if (isPlaying !== undefined) {
            this.setData({ isPlaying })
        }
        if (playModeIndex !== undefined) {
            this.setData({ playModeName: modeNames[playModeIndex]})
        }
    },

    onUnload() {
        playerStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
 
        playerStore.offStates(this.data.stateKeys, this. getPlayerInfosHandler)
    }
})