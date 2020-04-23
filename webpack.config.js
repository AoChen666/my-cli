const path = require('path');
const webpack = require('webpack');

const glob = require('glob');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BASE_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(BASE_PATH,'src');
const BUILD_PATH = path.resolve(BASE_PATH,'build');

const setMPA = () => { 
  var entry = {};
  var htmlPage = [];
  const entryFiles = glob.sync(path.resolve(__dirname,'./src/*/index.js'));
  entryFiles.map((item,idx)=>{
    let pageName = item.match(/\/src\/(.*)\/index\.js/)[1];
    if(pageName){
      entry[pageName] = item;
      htmlPage.push(new HtmlWebpackPlugin({
        template: path.resolve(SRC_PATH,'index.html'),
        filename: `${pageName}.html`,
        chunks: ['manifest','vendor-react','common',pageName],
        title: '我的你付款了浪费耐久',
        inject: true,  //将chunk引入至html
        // minify: {
        //   html5: true,
        //   collapseWhitespace: true,
        //   preserveLineBreaks: false,
        //   minifyCSS: true,
        //   minifyJS: true,
        //   removeComments: false //清理html中的注释
        // }
      }))
    }
  });
  return {
    entry,
    htmlPage
  }
 }
const {entry,htmlPage} = setMPA();
var webpackConfig = {

  entry: entry,
  output: {
    path: BUILD_PATH,
    filename: '[name]_[chunkhash:8].js'
  },
  // externals:{
  //   "react":'React',
  //   "react-dom":'ReactDOM'
  // },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",//将css通过style的形式插入html的头部head中
          {
            loader:"css-loader",  
            //开启cssModule，避免类名重复
            options:{
              modules:true,
              localIdentName:'_[name]_[local]-[hash:base64:5]'
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,//将css文件从html中提取出来
          "css-loader",
          "less-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              outputPath: 'images_r',
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)/,
        use: 'fiel-loader'
      }
    ]
  },
  mode:'development',
  plugins: [
    new webpack.DefinePlugin({
      //定义js全局变量
      "EVN": JSON.stringify(process.env.NODE_ENV)
    }),
    new MiniCssExtractPlugin({
      //将css从打包的js中提取出来
      filename: '[name]_[contenthash:8].css'
    }),
    new OptimizeCSSAssetsPlugin({
      //压缩css文件 css的压缩需要cssnano插件
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),
    new CleanWebpackPlugin()
  ].concat(htmlPage),
  // optimization: {
  //   splitChunks:{
  //     // chunks: "all",
  //     cacheGroups: {
  //       //  commons:{
  //       //   test:/react/,
  //       //   name: 'common',
  //       //   chunks:'all'
  //       // },
  //       // commons: {
  //       //   chunks: "initial",
  //       //   minChunks: 2,
  //       //   name:'common',
  //       //   maxInitialRequests: 5, // The default limit is too small to showcase the effect
  //       //   minSize: 0,// This is example is too small to create commons chunks,
  //       // },
  //       'vendor-react':{
  //         test:/node_modules/,
  //         chunks:'initial',
  //         name:'vendor-react',
  //         priority:1
  //       },
  //       // 'lodash':{
  //       //   test:/lodash/,
  //       //   chunks:'initial',
  //       //   name:'lodash',
  //       //   priority:2
  //       // }
  //     }
  //   },
  //   runtimeChunk: {   //将webpack的公共模块管理，信息清单等提取出来为一个公共包
  //     name: "manifest"
  //   }
  // },
  // devtool: 'source-map',//一般开发时配置用于调试，报错时可显示源码
  watchOptions: {
    ignored: /node_modules/,//不监听的文件
    poll: 1000, //轮询频率, 查看文件变化 ,每秒1000次
    aggregateTimeout: 300 //监听到文件发生变化后，延迟多少毫秒在执行
  }
}


module.exports = webpackConfig;



