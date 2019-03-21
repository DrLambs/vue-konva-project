const template = {
	state: {
		// type
		type: '',
		// 表单
		groupForm: {
			uniqueId: 0,
			type: 'rect',
			x: 10,
			y: 10,
			width: 200,
			height: 200,
			draggable: true,
			rotation: 0,
			scale: 1,
			disabled: false,
			side: 300,
			radius: 150,
			opacity: 1,
			stroke: 'transparent',
			strokeWidth: 1,
			src: 'http://' + document.domain + '/ad_material_temp/10185dbec6470fd3c8584b82311bb38c.png'
		},
		// 初始化表单
		initGroupForm: {
			uniqueId: 0,
			type: 'rect',
			x: 10,
			y: 1,
			width: 200,
			height: 200,
			draggable: true,
			rotation: 0,
			scale: 1,
			disabled: false,
			side: 300,
			radius: 150,
			opacity: 1,
			stroke: 'transparent',
			strokeWidth: 1,
			src: 'http://' + document.domain + '/ad_material_temp/10185dbec6470fd3c8584b82311bb38c.png'
		},
		// 列表
		configGroups: [],
		// fonts 表单
		fontForm: {
			uniqueId: 0,
			type: 'font',
			x: 200,
			y: 200,
			width: 170,
			height: 64,
			draggable: true,
			rotation: 0,
			scale: 1,
			fontText: '字样',
			fontFamily: 'Sans-serif',
			fontSize: 24,
			fontColor: '#ff0000',
			opacity: 1,
			disabled: false,
			stroke: 'transparent',
			strokeWidth: 1,
			src: 'http://' + document.domain + '/ad_material_temp/9ed0ff276fa8590f8dec7c1971a3b1c7.png'
		},
		// fonts 初始化
		initFontForm: {
			uniqueId: 0,
			type: 'font',
			x: 200,
			y: 200,
			width: 170,
			height: 64,
			draggable: true,
			rotation: 0,
			scale: 1,
			fontText: '字样',
			fontFamily: 'Sans-serif',
			fontSize: 24,
			fontColor: '#ff0000',
			opacity: 1,
			disabled: false,
			stroke: 'transparent',
			strokeWidth: 1,
			src: 'http://' + document.domain + '/ad_material_temp/9ed0ff276fa8590f8dec7c1971a3b1c7.png'
		},
		// fonts 列表
		configFonts: [],

		// 记录下一开始添加时的唯一ID
		globalUniqueId: 0,
		fontUniqueId: 0,
		// 当前选中的ID
		currentIndex: 0,
		fontCurrentIndex: 0,
		// 拖动定位
		dragStartX: 0,
		dragStartY: 0
	},
	mutations: {
		add(state, [config, type]) {
			let _configs = type === 'group' ? 'configGroups' : 'configFonts'

			state[_configs].push(config)
		},
		save(state, [config, type]) {

			let _configs = type === 'group' ? 'configGroups' : 'configFonts'
			let _current = type === 'group' ? 'currentIndex' : 'fontCurrentIndex'
			let _init = type === 'group' ? 'initGroupForm' : 'initFontForm'
			let _form = type === 'group' ? 'groupForm' : 'fontForm'
			let _unique = type === 'group' ? 'globalUniqueId' : 'fontUniqueId'

			state[_configs].forEach((item, index) => {
				if (parseInt(item['uniqueId']) === state[_current]) {
					// 替换原来的
					state[_configs].splice(index, 1, config)
				}
			})
			// 初始化
			state[_init].uniqueId = state[_unique]
			state[_form] = state[_init]
		},
		remove(state, type) {

			let _configs = type === 'group' ? 'configGroups' : 'configFonts'
			let _current = type === 'group' ? 'currentIndex' : 'fontCurrentIndex'
			let _init = type === 'group' ? 'initGroupForm' : 'initFontForm'
			let _form = type === 'group' ? 'groupForm' : 'fontForm'
			let _unique = type === 'group' ? 'globalUniqueId' : 'fontUniqueId'

			state[_configs].forEach((item, index) => {
				if (parseInt(item['uniqueId']) === state[_current]) {
					// 删除
					state[_configs].splice(index, 1)
				}
			})
			// 初始化
			state[_init].uniqueId = state[_unique]
			state[_form] = state[_init]
		},
		unique(state, [id, type]) {
			let _uid = type === 'group' ? 'globalUniqueId' : 'fontUniqueId'

			state[_uid] = id
		},
		current(state, [config, type]) {
			let _configs = type === 'group' ? 'configGroups' : 'configFonts'
			let _form = type === 'group' ? 'groupForm' : 'fontForm'
			let _current = type === 'group' ? 'currentIndex' : 'fontCurrentIndex'

			state[_configs].forEach(item => {
				// item.opacity = 1
				item.stroke = 'transparent'
			})

			state[_form] = config
			// state[_form].opacity = .7
			state[_form].stroke = '#19be6b'
			state[_current] = config.uniqueId
		},
		start(state, [x, y, type]) {
			let _form = type === 'group' ? 'groupForm' : 'fontForm'

			state.dragStartX = x - state[_form].x
			state.dragStartY = y - state[_form].y
		},
		move(state, [x, y, type]) {
			let _form = type === 'group' ? 'groupForm' : 'fontForm'

			state[_form].x = x - state.dragStartX
			state[_form].y = y - state.dragStartY
		},
		end(state, [x, y, type]) {
			let _form = type === 'group' ? 'groupForm' : 'fontForm'

			state[_form].x = x - state.dragStartX
			state[_form].y = y - state.dragStartY
		}
	}
}

export default template