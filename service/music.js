import { myRequest } from './index'

export function getMusicBanner() {
    return myRequest.get({
        url: '/banner'
    })
}
export function getPlaylistDetail(id) {
    return myRequest.get({
        url: '/playlist/detail',
        data: {
            id
        }
    })
}

export function getSongMenuList(cat="全部", limit = 6, offset = 0) {
    return myRequest.get({
        url: '/top/playlist',
        data: {
            cat,
            limit,
            offset
        }
    })
}

export function getSongMenuTag() {
    return myRequest.get({
        url: '/playlist/hot'
    })
}