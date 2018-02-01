import { Token } from 'token.js';
import {Config} from 'config.js'
class Base{
  constructor(){
    this.baseRequestUrl = Config.requestUrl
  }

  //http 请求类, 当noRefech为true时，不做未授权重试机制
  request(params, noRefetch){
    var that = this
    var url = this.baseRequestUrl + params.url;
    console.log(url);
    if(!params.type){
      params.type = 'GET'
    }
    wx.request({
      url: url,
      data: params.data,
      method: params.type,
      header:{
        'content-type':'application/json',
        'token':wx.getStorageSync('token')
      },
      success:function(res){
        // 判断以2（2xx)开头的状态码为正确
        // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
        console.log(res)
        var code = res.statusCode.toString();
        var startChar = code.charAt(0);
        if (startChar == '2') {
          params.sCallback && params.sCallback(res.data);
        } else {
          if (code == '401') {
            if (!noRefetch) {
              that._refetch(params);
            }
          }
          that._processError(res);
          params.eCallback && params.eCallback(res.data);
        }
      },fail:function(err){
        //wx.hideNavigationBarLoading();
        that._processError(err);
                // params.eCallback && params.eCallback(err);
      }
    })
  }
  
  _processError(err) {
    console.log(err);
  }

  _refetch(param) {
    var token = new Token();
    token.getTokenFromServer((token) => {
      this.request(param, true);
    });
  }
  // 获取元素上绑定的值
  getDataSet(event,key){
    return event.currentTarget.dataset[key];
  }
}

export{Base}