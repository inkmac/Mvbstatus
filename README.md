# Mvbstatus Electron App

一个基于 Electron + Express + Vue3 + TypeScript 构建的跨平台桌面应用，用于监控和展示 Mvbstatus 状态信息。

## Functions

### TestConnection

可以选择不同的 Train （1 - 53）， MPU （MPU1，MPU2）。对应不同的 Train IP
然后可以测试MPU是否接通

### StatusTable
将接收到的 MPU 数据解析处理后显示在 status-table 中
每5s一条数据
status-table 固定左侧 No Date Time 列，且固定表头。设置尺寸高度为 window 的 50% 高度 （适应window尺寸变化）
将错误/警告 用颜色标注，方便查看错误
并记录为log文件（文件名称按照时间划分，csv格式，默认存放 documents/MvbstatusLog/ 下）

### ControlButton
可以随时停止或开启 MPU 连接

### SettingsButton
可以通过点击右上角设置按钮，打开设置 （为dialog对话框）
使用json文件持久化存储，方便用户使用

- 通用设置
  1. 切换log文件的输出目录 （手动选择）


（但目前设置只有这一个选项（其他没有什么有必要的设置），但是已经搭建了模板，易于扩展更多设置）

## Pack

### Expire
设置过期时间，超出时间就无法使用，同时防止修改系统时间绕过（通过时间比对）

实现：
- 通过文件记录，但是文件做了处理，不易发现，且加密AES，但是若被发现且删除，就失效了 （未能想到更好的解决办法）
- 软件需要离线使用，所以无法使用服务器 请求校验否则更安全且易于实现

### Obfuscate
代码进行了混淆，对各个部分代码（main / preload / renderer）可以使用不同的混淆方案

实现：
- javascript-obfuscator + fast-glob
