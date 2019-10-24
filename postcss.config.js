module.exports = {
  plugins: {
    "autoprefixer": {}, //自动补全浏览器兼容前缀的配置，配置list在package.json文件中的"browserslist"选项
    "postcss-px2rem":{ //自动将px转化为rem
      remUnit: 75,//设计稿上一个rem的大小
      remOrecision: 8  //转化保留的小数位
    }
  }
}