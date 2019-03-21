const material = {
	state: {
		// 拖动定位
		dragStartX: 0,
		dragStartY: 0,

		// 所有模版列表
		configsList: [],

		// 当前选中的模版
		curConfig: null,

		// 当前选中的 group
		curId: -1,

		// 当前选中的 v-image
		form: {
			x: 0,
			y: 0,
			rotation: 0,
			scale: 0,
			src: ''
		},

		// 批量创建 - stage
		arrCreationTmp: []
	},
	mutations: {
		// deepClone
		deepClone(origin, target) {
			var target = target || {};
			var toStr = Object.prototype.toString;
			var arrStr = '[object Array]';
			for (var prop in origin) {
				if (origin.hasOwnProperty(prop)) {
					// 引用值
					if (origin[prop] !== null && typeof (origin[prop]) == 'object') {
						// 是数组
						if (toStr.call(origin[prop]) == arrStr) {
							target[prop] = [];
						}
						// 是对象
						else {
							target[prop] = {};
						}
						this.deepClone(origin[prop], target[prop]);
					}
					// 原始值
					else {
						// 可以转为数字并且不是NaN，转为数字存储。否则正常不转换存储
						if (typeof parseInt(origin[prop]) === 'number' && !isNaN(parseInt(origin[prop]))) {
							target[prop] = parseInt(origin[prop]);
						} else {
							target[prop] = origin[prop];
						}
					}
				}
			}
			return target;
		},
		// 创建 image 对象
		newImage(src) {
			let img = new Image()
			img.src = src
			return img
		},
		// 获取模版配置的列表
		getTmpConfigs(state, configs) {
			state.configsList.push(configs)
		},
		// 获取当前使用的模版配置
		getCurConfig(state, config) {
			// console.log(config)
			let matchStr = /https?:\/\/store2.live.ksmobile.net/ // online
			// 上传 psd gray

			// configStage
			if (config.configStage.url) {
				if (config.configStage.url.match(matchStr)) {
					config.configStage.url = config.configStage.url.replace(matchStr, 'http://' + document.domain)
				}
			}
			// configFonts
			config.configFonts.forEach(item => {
				if (item.src) {
					item.src = item.src.replace(matchStr, 'http://' + document.domain)
				}
				if (item.img.src) {
					item.img.src = item.img.src.replace(matchStr, 'http://' + document.domain)
				}
			})

			// configGroups
			config.configGroups.forEach(item => {
				if (item.src) {
					item.src = item.src.replace(matchStr, 'http://' + document.domain)
				}
				if (item.img.src) {
					item.img.src = item.img.src.replace(matchStr, 'http://' + document.domain)
				}
			})

			state.curConfig = config
		},
		// 选中的 v-image 配置与表单同步
		setId(state, id) {
			state.curId = id
			state.curConfig.configGroups.forEach(item => {
				if (item.uniqueId === id) {
					state.form = item.vImage
				}
			})
		},
		// 创建素材-更换图片
		setUrl(state, json) {
			let matchStr = /https?:\/\/store2.live.ksmobile.net/ // online
			// let matchStr = /https?:\/\/test-liveme-cms-datastore.s3.amazonaws.com/    // test

			// console.log(json)
			// 创建素材
			if (typeof json === 'string') {
				let {
					url,
					id,
					name,
					face_x,
					face_y,
					width,
					height
				} = JSON.parse(json)
				const originWidth = width
				const originHeight = height
				face_x = face_x ? face_x : width / 2
				face_y = face_y ? face_y : height / 2
				let newUrl = url
				if (url.match(matchStr)) {
					newUrl = url.replace(matchStr, 'http://' + document.domain) // online
				}
				// 替换模板中的group图片
				state.curConfig.configGroups.forEach(item => {
					if (item.uniqueId === state.curId) {
						item.vImage.src = newUrl
						item.materialId = id

						// 设置图片大小填充group框
						let _img = stage.mutations.newImage(newUrl)
						_img.onload = function () {
							// 图片宽高比
							const perImg = parseFloat((_img.width / _img.height).toFixed(2))
							// group 框宽高比
							const perGroup = parseFloat((item.width / item.height).toFixed(2))

							if (perImg >= perGroup) {
								item.vImage.height = item.height
								item.vImage.width = Math.ceil(item.height * perImg)

								// 图片缩放比例 x
								const perX = parseFloat((item.vImage.width / originWidth).toFixed(2))
								// group 框中心点 x
								const middleX = parseFloat((item.width / 2).toFixed(2))
								// 图片缩放之后的人脸坐标
								const faceX = parseFloat((face_x * perX).toFixed(2))
								// 人脸居中：修改图片坐标 face_x
								item.vImage.x = Math.floor(middleX - faceX)
								if (item.vImage.x > 0) {
									item.vImage.x = 0
								} else if (item.vImage.x < item.width - item.vImage.width) {
									item.vImage.x = item.width - item.vImage.width
								}
							} else if (perImg < perGroup) {
								item.vImage.width = item.width
								item.vImage.height = Math.ceil(item.width / perImg)

								// 图片缩放比例 y
								const perY = parseFloat((item.vImage.height / originHeight).toFixed(2))
								// group 框中心点 x
								const middleY = parseFloat((item.height / 2).toFixed(2))
								// 图片缩放之后的人脸坐标
								const faceY = parseFloat((face_y * perY).toFixed(2))
								// 人脸居中：修改图片坐标 face_y
								item.vImage.y = Math.floor(middleY - faceY)
								if (item.vImage.y > 0) {
									item.vImage.y = 0
								} else if (item.vImage.y < item.height - item.vImage.height) {
									item.vImage.y = item.height - item.vImage.height
								}
							}

							item.vImage.img = _img
							// console.log(item.vImage.img.src)
						}

						// 替换主播名字
						state.curConfig.configFonts.forEach(item => {
							if (item.fontText && item.uniqueId === state.curId) {
								item.fontText = item.fontText.replace(/(?<=#).*?(?=#)/g, name)
							}
						})
					}
				})
			}
			// 批量创建
			else {
				let clone = []
				let arrJson = Array.from(json)
				// console.log(arrJson)

				for (let i = 0, len = arrJson.length; i < len; i++) { // 生成多少个素材
					clone[i] = {}
					for (let j = 0, len2 = state.curConfig.configGroups.length; j < len2; j++) { // 每个素材里的 group
						if (arrJson[i][j].url.match(matchStr)) { // online
							arrJson[i][j].url = arrJson[i][j].url.replace(matchStr, 'http://' + document.domain) // online
						}
						state.curConfig.configGroups[j].vImage.src = arrJson[i][j].url
						state.curConfig.configGroups[j].materialId = arrJson[i][j].id
						state.curConfig.configGroups[j].materialName = arrJson[i][j].name
						state.curConfig.configGroups[j].vImage.originWidth = arrJson[i][j].width
						state.curConfig.configGroups[j].vImage.originHeight = arrJson[i][j].height
						// 是否有人脸标记：记录人脸中心点 (x, y)，没有则 (0, 0)
						if (arrJson[i][j].face) {
							state.curConfig.configGroups[j].vImage.face_x = arrJson[i][j].face_x ? arrJson[i][j].face_x : Math.floor(arrJson[i][j].width / 2)
							state.curConfig.configGroups[j].vImage.face_y = arrJson[i][j].face_y ? arrJson[i][j].face_y : Math.floor(arrJson[i][j].height / 2)
						} else {
							state.curConfig.configGroups[j].vImage.face_x = Math.floor(arrJson[i][j].width / 2)
							state.curConfig.configGroups[j].vImage.face_y = Math.floor(arrJson[i][j].height / 2)
						}
					}
					// 复制将要生成的每个素材模板配置，并push给arrCreationTmp进行渲染
					stage.mutations.deepClone(state.curConfig, clone[i])

					clone[i].configGroups.forEach(item => {
						let _name = item.materialName
						let _curId = item.uniqueId

						// 图片显示大小
						let _img = stage.mutations.newImage(item.vImage.src)
						item.vImage.img = _img
						// console.log(item.vImage.img.src)

						_img.onload = function () {
							// 图片宽高比
							const perImg = parseFloat((_img.width / _img.height).toFixed(2))
							// group 框宽高比
							const perGroup = parseFloat((item.width / item.height).toFixed(2))

							if (perImg >= perGroup) {
								item.vImage.height = item.height
								item.vImage.width = Math.ceil(item.height * perImg)

								// 图片缩放比例 x
								const perX = parseFloat((item.vImage.width / item.vImage.originWidth).toFixed(2))
								// group 框中心点 x
								const middleX = parseFloat((item.width / 2).toFixed(2))
								// 图片缩放之后的人脸坐标
								const faceX = parseFloat((item.vImage.face_x * perX).toFixed(2))
								// 人脸居中：修改图片坐标 face_x
								item.vImage.x = Math.floor(middleX - faceX)
								if (item.vImage.x > 0) {
									item.vImage.x = 0
								} else if (item.vImage.x < item.width - item.vImage.width) {
									item.vImage.x = item.width - item.vImage.width
								}
							} else if (perImg < perGroup) {
								item.vImage.width = item.width
								item.vImage.height = Math.ceil(item.width / perImg)

								// 图片缩放比例 y
								const perY = parseFloat((item.vImage.height / item.vImage.originHeight).toFixed(2))
								// group 框中心点 x
								const middleY = parseFloat((item.height / 2).toFixed(2))
								// 图片缩放之后的人脸坐标
								const faceY = parseFloat((item.vImage.face_y * perY).toFixed(2))
								// 人脸居中：修改图片坐标 face_y
								item.vImage.y = Math.floor(middleY - faceY)
								if (item.vImage.y > 0) {
									item.vImage.y = 0
								} else if (item.vImage.y < item.height - item.vImage.height) {
									item.vImage.y = item.height - item.vImage.height
								}
							}

							item.vImage.img = _img
						}

						// 替换主播名字
						clone[i].configFonts.forEach(item => {
							if (item.uniqueId === _curId && item.fontText !== '') {
								item.fontText = item.fontText.replace(/#.*?#/g, _name)
							}
						})
					})
					clone[i].configFonts.forEach(item => {
						item.img = stage.mutations.newImage(item.src)
					})
					clone[i].showform = false
					clone[i].name = state.curConfig.name
					// 通过 arrCreationTmp 渲染stage
					state.arrCreationTmp.push(clone[i])
				}
			}
		},
		// 拖动
		start(state, [x, y]) {
			state.dragStartX = x - state.form.x
			state.dragStartY = y - state.form.y
		},
		move(state, [x, y]) {
			state.form.x = x - state.dragStartX
			state.form.y = y - state.dragStartY
		},
		end(state, [x, y]) {
			state.form.x = x - state.dragStartX
			state.form.y = y - state.dragStartY
		}
	}
}

export default material