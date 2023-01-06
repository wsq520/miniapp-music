import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric} from '../service/player'
import { parseLyric } from '../utils/parse-lyric'

// 创建一个播放器
export const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
    state: {
        playSongList: [],
        playSongIndex: 0,

        id: 0,
        currentSong: {},
        currentTime: 0,
        durationTime: 0,
        lyricInfos: [],
        currentLyricText: "",
        currentLyricIndex: -1,

        isFirstPlay: true,

        isPlaying: false,
        playModeIndex: 0
    },
    actions: {
        playMusicWithSongIdAction(ctx, id) {
            // 将数据恢复到初始状态
            ctx.currentSong = {}
            ctx.durationTime = 0
            ctx.currentTime = 0
            ctx.currentLyricText = ""
            ctx.currentLyricIndex = 0
            ctx.lyricInfos = []
            
            // 保存id
            ctx.id = id
            ctx.isPlaying = true
    
            // 根据id获取歌曲信息
            getSongDetail(id).then(res => {
                console.log(res)
                ctx.currentSong = res.songs[0]
                ctx.durationTime = res.songs[0].dt
            })
    
            // 获取歌词
            getSongLyric(id).then(res => {
                // console.log(res);
                const lycString = res.lrc.lyric
                const lyricInfos = parseLyric(lycString)
                ctx.lyricInfos = lyricInfos 
            })
    
            // 播放当前歌曲
            audioContext.stop()
            audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
            audioContext.autoplay = true
    
            // 首次播放才需要添加监听事件
           if(ctx.isFirstPlay) {
                ctx.isFirstPlay = false
                
                audioContext.onTimeUpdate(() => {
                    // 1.获取当前的播放时间
                    ctx.currentTime = audioContext.currentTime * 1000
                    
                    //匹配正确歌词    
                    if(!ctx.lyricInfos.length) return 
                    let index = ctx.lyricInfos.length - 1
                    for(let i = 0; i < ctx.lyricInfos.length; i++) {
                        const info = ctx.lyricInfos[i]
                        if(info.time > audioContext.currentTime * 1000) {
                            index = i - 1
                            break
                        }
                    }
                    if(index === ctx.currentLyricIndex || index === -1) return

                    const currentLyricText = ctx.lyricInfos[index].text
                    ctx.currentLyricText = currentLyricText
                    ctx.currentLyricIndex = index
                })
        
                audioContext.onWaiting(() => {
                    audioContext.pause()
                })
        
                audioContext.onCanplay(() => {
                    audioContext.play()
                })
        
                audioContext.onEnded(() => {
                    if(audioContext.loop) return 
                    this.dispatch("playNewMusicAction", true)
                })
            }
        },
        changeMusicStatusAction(ctx) {
            if(ctx.isPlaying) {
                audioContext.pause()
                ctx.isPlaying = false
            } else {
                audioContext.play()
                ctx.isPlaying = true
            }
        },
        changePlayModeAction(ctx) {
             // 计算新的模式
            let modeIndex = ctx.playModeIndex
            modeIndex = modeIndex + 1
            if(modeIndex === 3) modeIndex = 0

            if(modeIndex === 1) {
                audioContext.loop = true
            } else {
                audioContext.loop = false
            }

            // 保存当前的播放模式
           ctx.playModeIndex = modeIndex
        },
        playNewMusicAction(ctx, isNext = true) {
            const length = ctx.playSongList.length

            // 获取下一首歌的索引
            let index = ctx.playSongIndex
    
            switch (ctx.playModeIndex) {
                case 1:
                case 0: 
                    index = isNext ? index + 1 : index - 1
                    if(index === length) index = 0
                    if(index === -1) index = length - 1
                    break
                case 2:
                    // 随机播放
                    index = Math.floor(Math.random() * length)
                    break
            }
    
            // 获取下一首歌曲的信息
            const newSong = ctx.playSongList[index]
            console.log(newSong)
    
           
            // 播放歌曲
            this.dispatch("playMusicWithSongIdAction", newSong.id)
    
            // store保存最新的索引
            ctx.playSongIndex = index
        }
    }
})

export default playerStore