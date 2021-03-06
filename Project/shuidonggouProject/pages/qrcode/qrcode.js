// pages/index/index.js
var QRCode = require('../../utils/weapp-qrcode.js')

var qrcode;

Page({
    data: {
		userInfo:null
    },
    onLoad: function (options) {
		
		var info = JSON.parse(options.item);
		console.log(info)
		this.setData({
			userInfo: info
		})
		var ascStr = this.str2Ascii(info.thirdReserveNo)
		
        qrcode = new QRCode('canvas', {
			text: info.thirdReserveNo,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "white",
            correctLevel: QRCode.CorrectLevel.H,
        });
    },
	
	str2Ascii: function (info){
		var val = ''
		for (var char in info){
			var ascChar = char.charCodeAt();
			val = val + ' '
			val = val + ascChar
		}
		return val;
	},
    inputHandler: function (e) {
        var value = e.detail.value
        this.setData({
            text: value
        })
    },
    tapHandler: function () {
        // 传入字符串生成qrcode
        qrcode.makeCode(this.data.text)
    },
    save: function () {
        console.log('save')
        wx.showActionSheet({
            itemList: ['保存图片'],
            success: function (res) {
                console.log(res.tapIndex)
                if (res.tapIndex == 0) {
                    qrcode.exportImage(function (path) {
                        wx.saveImageToPhotosAlbum({
                            filePath: path,
                        })
                    })
                }
            }
        })
    }
})