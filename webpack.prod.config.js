const path = require('path');
const webpack = require('webpack');

const glob = require('glob');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlWebpackExternalsPlugin=require('html-webpack-externals-plugin');
const copyHtmlWebpackPlugin = require('copy-webpack-plugin');

const BASE_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(BASE_PATH,'src');
const BUILD_PATH = path.resolve(BASE_PATH,'build');

const setMPA = () => {
  var pageTitle = ['我的','首页','商城']
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
        chunks: ['vender-react','commons',pageName],
        title: pageTitle[idx],
        inject: true,  //将chunk引入至html
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false //清理html中的注释
        }
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
          "style-loader",
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
          MiniCssExtractPlugin.loader,
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
              outputPath: 'images',
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
  mode:'production',
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
    new CleanWebpackPlugin(),
    // new copyHtmlWebpackPlugin([
    //   {
    //   from:path.resolve(__dirname,'./node_modules/react/umd/react.production.min.js'),
    //   to:path.resolve(__dirname,'./build/vendor/react.production.min.js'),
    //   },
    //   {
    //     from:path.resolve(__dirname,'./node_modules/react-dom/umd/react-dom.production.min.js'),
    //     to:path.resolve(__dirname,'./build/vendor/react-dom.production.min.js'),
    //     }
    // ]),
    // new htmlWebpackExternalsPlugin({
    //   externals:[
    //     {
    //       module:'react',
    //       // entry:'vendor/react.production.min.js',
    //       entry:'https://cdn.bootcss.com/react/16.9.0-rc.0/umd/react.production.min.js',
    //       global:'React'
    //     },
    //     {
    //       module:'react-dom',
    //       // entry:'vendor/react.production.min.js',
    //       entry:'https://cdn.bootcss.com/react-dom/16.9.0-rc.0/umd/react-dom.production.min.js',
    //       global:'ReactDOM'
    //     }
    //   ]
    // })
  ].concat(htmlPage),
  optimization: {
    splitChunks:{
      cacheGroups: {
        // commons:{
        //   test:/(react|react-dom)/,
        //   name: 'common',
        //   chunks:'all'
        // }
        commons: {
          chunks: "initial",
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          minSize: 0,// This is example is too small to create commons chunks,
        },
        'vender-react':{
          test:/react/,
          chunks:'initial',
          name:'vender-react',
          enforce:true
        }
      }
    }
  },
  // devtool: 'source-map',//一般开发时配置用于调试，报错时可显示源码
  watchOptions: {
    ignored: /node_modules/,//不监听的文件
    poll: 1000, //轮询频率, 查看文件变化 ,每秒1000次
    aggregateTimeout: 300 //监听到文件发生变化后，延迟多少毫秒在执行
  }
}


module.exports = webpackConfig;



