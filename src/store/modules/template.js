import config from "../../libs/config";

const template = {
	state: {
		stageConfig: {
			width: 960,
			height: 600,
			url: "http://uploads.5068.com/allimg/1712/144-1G2091PJ9.jpg"
		},
		// config 类型: 模板框/装饰
		configType: 'group',
		// 表单初始化
		initConfig: config.initConfig,
		// 表单
		config: config.config,
		// 配置列表
		configList: {
			group: [],
			font: []
		},
		// 记录下一开始添加时的唯一ID
		uniqueId: {
			group: 0,
			font: 0
		},
		// 当前选中的ID
		currentId: {
			group: 0,
			font: 0
		},
		// 拖动定位
		dragStartX: 0,
		dragStartY: 0
	},
	mutations: {
		// 设置当前配置类型: group/font
		setConfigType(state, type) {
			state.configType = type;
		},
		// 获取唯一 id
		unique(state, id) {
			state.uniqueId[state.configType] = id;
		},
		// 添加配置
		add(state, config) {
			state.configList[state.configType].push(config);
		},
		// 保存配置
		save(state, config) {
			state.configList[state.configType].forEach((item, index) => {
				if (parseInt(item['uniqueId']) === state.currentId[state.configType]) {
					// 替换原来的
					state.configList[state.configType].splice(index, 1, config);
				}
			});
			// 初始化
			state.initConfig[state.configType].uniqueId = state.uniqueId[state.configType];
			state.config[state.configType] = state.initConfig[state.configType];
		},
		// 删除配置
		remove(state) {
			state.configList[state.configType].forEach((item, index) => {
				if (parseInt(item['uniqueId']) === state.currentId[state.configType]) {
					// 删除
					state.configList[state.configType].splice(index, 1);
				}
			});
			// 初始化
			state.initConfig[state.configType].uniqueId = state.uniqueId[state.configType];
			state.config[state.configType] = state.initConfig[state.configType];
		},
		// 获取当前配置
		current(state, config) {
			state.configList[state.configType].forEach(item => {
				item.stroke = 'transparent';
			});
			state.config[state.configType] = config;
			state.config[state.configType].stroke = '#DE421A';
			state.currentId[state.configType] = config.uniqueId;
		},
		start(state, {x, y}) {
			state.dragStartX = x - state.config[state.configType].x;
			state.dragStartY = y - state.config[state.configType].y;
		},
		move(state, {x, y}) {
			state.config[state.configType].x = x - state.dragStartX;
			state.config[state.configType].y = y - state.dragStartY;
		},
		end(state, {x, y}) {
			state.config[state.configType].x = x - state.dragStartX;
			state.config[state.configType].y = y - state.dragStartY;
		}
	}
}

export default template;
