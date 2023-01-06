  // 封装成类
  class MyRequest {
    constructor(baseURL) {
      this.baseURL = baseURL
    }
  
    request(options) {
      const { url } = options
      return new Promise((resolve, reject) => {
        wx.request({
         ...options,
         url: this.baseURL + url,
         success: res => {
           resolve(res.data)
         },
         fail: reject
        })
      })
    }
    get(options) {
      return this.request({...options, method: "get"})
    }
    post(options) {
      return this.request({...options, method: "post"})
    }
  }
  
  export const myRequest = new MyRequest("http://codercba.com:9002")