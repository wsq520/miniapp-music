import { myRequest } from './index'

export function getTopMV(offset = 0, limit = 20) {
    return myRequest.get({
        url: '/top/mv',
        data: {
            limit,
            offset
        }
    })
}

export function getMVUrl(id) {
    return myRequest.get({
        url: '/mv/url',
        data: {
            id
        }
    })
}

export function getMVInfo(mvid) {
    return myRequest.get({
        url: '/mv/detail',
        data: {
            mvid
        }
    })
}

export function getMVRelate(id) {
    return myRequest.get({
        url: '/related/allvideo',
        data: { id }
    })
}