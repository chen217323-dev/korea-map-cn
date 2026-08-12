# 韩国 NAVER 地图（中文手机网页版）

## 免费版使用方法

不需要 NAVER Cloud、API Key 或银行卡。将整个文件夹部署到任意静态网站服务即可，手机定位功能需要 HTTPS。

本地预览可在此目录运行：`python -m http.server 8080`，再访问 `http://localhost:8080`。

网页使用 Kakao Maps JavaScript API。支持当前位置、目的地搜索、地图标记，以及公交、步行、驾车、骑行路线入口。必须通过已登记的域名访问，不能直接使用 `file://` 打开。
