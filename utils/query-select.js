export function querySelect(selector) {
    return new Promise((resolve, reject) => {
        const query = wx.createSelectorQuery()
        query.select(selector).boundingClientRect()
        query.exec((res) => {
            resolve(res)
        })
    })
}