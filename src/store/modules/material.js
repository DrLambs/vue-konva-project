import util from '../../libs/util';

const material = {
	state: {
		// 当前选中的模版
		currentTemplate: null,
		// 当前选中的 group
		curId: -1,
		// 当前选中的 v-image
		config: {
			x: 0,
			y: 0,
			rotation: 0,
			scale: 0,
			src: ''
		},
		// 拖动定位
		dragStartX: 0,
		dragStartY: 0
	},
	mutations: {
		// 获取当前使用的模版配置
		getCurrentTepmlate(state, config) {
			state.currentTemplate = config;
		},
		// 选中的 v-image 配置与表单同步
		setImageId(state, id) {
			state.curId = id
			state.currentTemplate.configList.group.forEach(item => {
				if (item.uniqueId === id) {
					state.config = item.vImage
				}
			})
		},
		// 创建素材-更换图片
		setUrl(state, json) {
			// 创建素材
			if (typeof json === 'string') {
				let {
					url,
					id,
					face_x,
					face_y,
					width,
					height
				} = JSON.parse(json)
				const originWidth = width
				const originHeight = height
				face_x = face_x ? face_x : width / 2
				face_y = face_y ? face_y : height / 2
				// 替换模板中的group图片
				state.curConfig.configGroups.forEach(item => {
					if (item.uniqueId === state.curId) {
						item.vImage.src = url
						item.materialId = id

						// 设置图片大小填充group框
						let _img = util.newImage(url)
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
						}
					}
				})
			}
		},
		start(state, {x, y}) {
			state.dragStartX = x - state.config.x;
			state.dragStartY = y - state.config.y;
		},
		move(state, {x, y}) {
			state.config.x = x - state.dragStartX;
			state.config.y = y - state.dragStartY;
		},
		end(state, {x, y}) {
			state.config.x = x - state.dragStartX;
			state.config.y = y - state.dragStartY;
		}
	}
}

export default material