export const color = [
  "#F48D43",
  "#E3E330",
  "#1BB493",
  "#23D2F0",
  "#7DB922",
  "#7C71FF",
  "#F5BE55",
  "#398BFF",
  "#37AEEF",
  "#17EDB3",
  "#FF6A6A",
  "#AD0EFF",
  "#C774E6",
  "#EA4880",
  "#1A67D5",
  "#31CC1D",
  "#EC5633",
];

export const compare = (key) => {
  return function (m, n) {
    var a = (m[key]+'').split('%')[0];
    var b = (n[key]+ '').split('%')[0];
    return b - a; //升序
  };
};

export const countyList = [
  "海曙区",
  "江北区",
  "北仑区",
  "镇海区",
  "鄞州区",
  "奉化区",
  "象山县",
  "宁海县",
  "余姚市",
  "慈溪市",
];

export const coefficient = 0.963378896312961;

export const coefficientCounty = [
  "北仑区",
  "奉化区",
  "象山县",
  "宁海县",
  "余姚市",
];

export const husbandryList = [
  { key: "养殖场名称", dataIndex: "养殖场名称", value: "" },
  { key: "法定代表人 (业主)", dataIndex: "法定代表人", value: "" },
  { key: "联系电话", dataIndex: "联系电话", value: "" },
  { key: "占地面积(亩)", dataIndex: "占地面积", value: "" },
  { key: "畜舍面积(平方米)", dataIndex: "畜舍面积", value: "" },
  { key: "畜禽养殖代码", dataIndex: "畜禽养殖代码", value: "" },
  { key: "所在市", dataIndex: "CITY", value: "" },
  { key: "县（市、区）", dataIndex: "COUNTY", value: "" },
  { key: "乡镇（街道）", dataIndex: "TOWN", value: "" },
  { key: "村", dataIndex: "VILLAGE", value: "" },
];

export const vegetableList = [
  { key: "基地名称", dataIndex: "基地名称", value: "" },
  { key: "类别", dataIndex: "类别", value: "" },
  { key: "规模（亩）", dataIndex: "规模", value: "" },
  { key: "商标品牌", dataIndex: "商标品牌", value: "" },
  { key: "法人代表", dataIndex: "法人代表", value: "" },
  { key: "联系电话", dataIndex: "联系电话", value: "" },
  { key: "区县市", dataIndex: "COUNTY", value: "" },
  { key: "镇街", dataIndex: "TOWN", value: "" },
  { key: "村", dataIndex: "VILLAGE", value: "" },
];

export const aquaticList = [
  { key: "养殖主体名称", dataIndex: "养殖主体名称", value: "" },
  { key: "负责人名称", dataIndex: "负责人姓名", value: "" },
  { key: "联系电话", dataIndex: "联系电话", value: "" },
  { key: "养殖品种", dataIndex: "养殖品种", value: "" },
  { key: "养殖规模（亩）", dataIndex: "养殖规模", value: "" },
  { key: "产量（吨）", dataIndex: "产量", value: "" },
  { key: "监管员姓名", dataIndex: "监管员姓名", value: "" },
  { key: "监督员电话", dataIndex: "监督员电话", value: "" },
  { key: "区县市", dataIndex: "COUNTY", value: "" },
  { key: "镇街", dataIndex: "TOWN", value: "" },
];

export const boardData = [
  {
    title: "2021年农林牧渔总产值",
    number: 556.28,
    suffix: "亿元",
  },
  {
    title: "2021年农林牧渔总产值同比增长",
    number: 4.0,
    suffix: "%",
  },
  {
    title: "2021年农林牧渔增加值",
    number: 372.5,
    suffix: "亿元",
  },
  {
    title: "2021年农林牧渔增加值同比增长",
    number: 3.0,
    suffix: "%",
  },
  {
    title: "农业劳动生产率",
    number: 8.3,
    suffix: "万元/人",
  },
  {
    title: "农业亩均产值",
    number: 1.3,
    suffix: "万元/亩",
  },
];

export const baseTitleMap = {
  1: "畜牧养殖场详情",
  2: "蔬菜种植基地详情",
  3: "水产养殖基地详情",
};
