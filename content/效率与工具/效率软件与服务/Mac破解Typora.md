---
title: Mac破解Typora
date: 2025-08-07T20:55:53+08:00
updated: 2025-08-07T20:59:11+08:00
---

# Mac 破解 Typora

# 一、安装

**1.首先到官网下载 Mac 版的 Typora, ****下载地址 ****：[https://typoraio.cn/](https://typoraio.cn/)**

（1）打开默认中文站

![](./img/VN2cbnOktobUwBxvwi7c3Y0rn2c.png)

（2）往下滑，下载 Mac 版

![](./img/PnkOb3eUloxkN3xLY2ZcGKlMnFf.png)

**2.下载完成后，会看到 Typora.dmg 文件，点击打开文件**

![](./img/VKetbCPoYo3Z4OxJgODcuqxdnae.png)

**3.打开 Typora.dmg 文件，鼠标落在左边 app 图标上，按住拖拽到右边图标，安装完成。**

![](./img/PzcJbz53Do5Bm1xJNmkcshFln1g.png)

**4.打开启动台**

![](./img/K2FLbXYiOoIo8sxV6MdcIZGpnWh.png)

**，可以看到 Typora 软件已安装成功。**

![](./img/PKIDbZeEjoIdfcxRTbTcE6FsnWd.png)

**5.点击 Typora 进入 app 的欢迎界面， 发现 未激活，只能试用 14 天 **。下面进行激活的操作。

### 二、激活

**1.打开访达**

![](./img/Z8NlbMvGJoUhVPxoVQNcJ2gSnnX.png)

**，按快捷键 Command+Shift+G 打开搜索，**

![](./img/OL1ibJ3QvoCJd6xq3TWc3UxDncg.png)

**2.在上图红框内输入 **`/Applications/Typora.app/Contents/Resources/TypeMark`
**点击回车，快速进入目录。**

![](./img/Cty3bSbwGoyz12x68dgcLsNKn5Y.png)

此时会看到搜索结果有很多，选第一个即可;

![](./img/Ffmib36mxor7JFx6N2Tcy1ZmnCd.png)

**3.选中后点击回车，跳转到该文件夹下；**
**打开文件：page-dist 文件夹–>static–>js–>LicenseIndex.开头的文件**

![](./img/Jdt0b9tYdovpqWxwI9PcfN2JnOc.png)

![](./img/KNAKbk9DEoOYUex5JcEc4Of8nhc.png)

![](./img/UsYkb2TH7ooIkOxqIqpcjm2snEd.png)

![](./img/DQzCbJMHWol9QexaE2AcsaPyn1e.png)

**4.选中该文件后右键（Mac 的右键：control+ 鼠标单击）–> 打开方式–> 用「文本编辑」打开**

![](./img/LPnXbIEcdo9O1RxYAMMcLQhUnWd.png)

**5.打开后，点击顶部菜单栏「编辑」–>「查找」–>「查找」，进行搜索；**
搜索： `hasActivated="true"==e.hasActivated` ,
并将这段替换为 `hasActivated="true"=="true"` 。

![](./img/Yqs9bZeGRomT3GxvjIkcnpp5nAf.png)

![](./img/VyzlbFshIobXBOxGOs7cMFUIntf.png)

**6.替换后，参考黄色高亮部分，保存该文件，即可。**

![](./img/MRCtbeM27omJ09xN4a7cjHR3nNe.png)

**7.保存后，重新打开 Typora 软件，欢迎界面撒花 🎉🎉🎉，显示已激活。okk 结束！！**

![](./img/CtMUb9Jklo3FjmxmlJycDPFznqe.png)

[注：参考文献：mac 安装并激活 Typora](https://www.jalen-qian.com/p/mac%E5%AE%89%E8%A3%85%E5%B9%B6%E6%BF%80%E6%B4%BBtypora/)
