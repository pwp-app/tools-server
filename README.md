# tools-server

## 概述

出于不想用其他人的API/收费API的原因，专门抽出一些API服务做到这个项目里，用于向其他项目提供一些通用的API。

## API说明

当前API版本号为v1，“/v1”将为所有API的公共前缀。默认监听端口7700。

提供的API如下：

## QRCode

提供二维码生成和解码服务，解码使用jsqr，可能存在一定的识别率问题。

### API

/qrcode/encode

支持方法：GET

提交参数：text:string

/qrcode/decode

支持方法：GET、POST

提交参数：base64:string, url:url

参数二选一，GET方法只支持提交图片的URL。

## npm

提供查询npm包信息和下载量的服务。

### API

/npm/registry

支持方法：GET

提交参数：package:string

/npm/downloads

支持方法：GET

提交参数：start:string(YYYY-MM-DD), end:string(YYYY-MM-DD), package:string

## 部署说明

参考egg.js服务器通用的部署方法，在克隆本仓库代码后，使用npm install安装依赖，并安装egg-scripts，即可使用npm run start启动服务器。

### 环境需求

操作系统无特定需求，可以运行node即可，服务器需要redis，请确保你有可用的redis。

### 配置文件

/config/keys.tmpl.js

复制一份为/config/keys.js，填写其中的内容。

cookie: 用于加密Cookie的密钥

redis：redis访问密钥，请确保你的redis是有访问密码的。
