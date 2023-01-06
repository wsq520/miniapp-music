import { getSongMenuTag, getSongMenuList } from '../../service/music'

Page({
    data: {
        songMenus: []
    },
    onLoad() {
        this.fetchAllMenuList()
    },
    async fetchAllMenuList() {
        const tagRes = await getSongMenuTag()
        const tags = tagRes.tags

        const allpromises = []
        for(const tag of tags) {
            const promise = getSongMenuList(tag.name)
            allpromises.push(promise)
        }
        // all方法等待所有promise有结果之后才会回调resolve
        Promise.all(allpromises).then(res => {
            console.log(res);
            this.setData( { songMenus: res })
        })
    }
})