import { ScoutSceneTheme } from '../types';

export const initialScenes: ScoutSceneTheme[] = [
  {
    id: 'scene-sakura-market',
    name: '🌸 绯樱赛博集市',
    backgroundUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    characterUrl: '',
    statusText: '探针小助手正在集市熙攘人流中捕捉行为偏差...',
    tipsList: [
      '小贴士：携带 NEAR-MISS 多的规则卡采风，更容易辨别高精度的认知边界！',
      '探针正在比对摊位老板的还价原话与博弈话术...',
      '正在从嘈杂的生活日常中提取高价值冲突切片...'
    ]
  },
  {
    id: 'scene-warm-radio',
    name: '📻 暖阳治愈电台',
    backgroundUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
    characterUrl: '',
    statusText: '探针正在监听职场匿名树洞与困境调频广播...',
    tipsList: [
      '小贴士：真正的规则经得起复杂情境的反复打磨与反证！',
      '电台正在接收来自深海数据中心的匿名周报吐槽...',
      '探针记录下了一段关于“紧急需求”的对话音频...'
    ]
  },
  {
    id: 'scene-coffee-study',
    name: '☕ 街角深思书阁',
    backgroundUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    characterUrl: '',
    statusText: '探针正隐身于书架角落，观察人们面对焦虑时的物理微动作...',
    tipsList: [
      '小贴士：标签不是证据，必须指出事件里的具体原话或动作。',
      '观察到一位程序员推开键盘，正站起身准备接水...',
      '正在把一段拉扯两小时的会议纪要降维提炼...'
    ]
  },
  {
    id: 'scene-sonar-matrix',
    name: '🛰️ 纯净声呐雷达 (极客视效)',
    backgroundUrl: '', // 空 URL 触发内置纯 CSS 动态扫描与网格视效
    characterUrl: '',
    statusText: '动态声呐已启动，正在全频段扫描真实世界野生困境事件池...',
    tipsList: [
      '小贴士：5秒极速测试档位无需消耗真实时间，极速验证算法闭环！',
      '声呐脉冲波穿透 12 个真实历史与商业决策切片...',
      '正在锁定一个高置信度的决策困境事件...'
    ]
  }
];
