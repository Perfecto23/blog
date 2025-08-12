---
title: Linux实用命令
date: 2025-08-08T00:54:42+08:00
updated: 2025-08-10T23:53:44+08:00
---

# Linux 实用命令

作为前端开发工程师，我们虽然主要与浏览器和前端框架打交道，但 Linux 命令行技能同样不可或缺。无论是服务器部署、CI/CD 流程配置还是日常开发环境操作，掌握一些实用的 Linux 命令都能极大提升工作效率。

## 文件与目录操作

### 基础导航与查看

```bash
# 切换目录
cd path/to/directory

# 回到上一级目录
cd ..

# 回到用户主目录
cd ~

# 显示当前目录路径
pwd

# 列出目录内容
ls
ls -l  # 详细列表
ls -la # 显示所有文件(包括隐藏文件)
```

### 文件操作

```bash
# 创建文件
touch filename.txt

# 创建目录
mkdir directoryname
mkdir -p parent/child  # 创建多级目录

# 复制文件/目录
cp source target
cp -r sourcedir targetdir  # 复制目录

# 移动/重命名
mv oldname newname

# 删除文件
rm filename
rm -f filename  # 强制删除，不提示

# 删除目录
rm -r dirname
rm -rf dirname  # 强制删除目录及其内容
```

## 文本处理

前端开发经常需要处理配置文件、日志文件等，这些命令非常实用：

```bash
# 查看文件内容
cat filename.txt

# 分页查看长文件
less filename.txt  # 按q退出，按/搜索

# 查看文件前n行
head -n 10 filename.txt

# 查看文件后n行
tail -n 10 filename.txt
tail -f logfile.txt  # 实时跟踪日志更新

# 搜索文件内容
grep "searchterm" filename.txt
grep -r "searchterm" directory/  # 递归搜索目录
grep -i "searchterm" filename.txt  # 忽略大小写

# 查找文件
find /path -name "filename"
find . -type f -name "*.js"  # 查找当前目录下所有.js文件
```

## 系统信息与进程管理

```bash
# 查看系统信息
uname -a

# 查看磁盘空间
df -h

# 查看目录占用空间
du -sh directory/

# 查看进程
ps aux
ps aux | grep "processname"  # 查找特定进程

# 终止进程
kill process_id
kill -9 process_id  # 强制终止
```

## 网络相关

```bash
# 查看网络接口信息
ifconfig
ip addr

# 测试网络连接
ping google.com

# 查看网络连接
netstat -tuln
ss -tuln  # 更现代的替代命令

# 下载文件
curl -O http://example.com/file.zip
wget http://example.com/file.zip

# 查看域名解析
nslookup example.com
dig example.com
```

## 权限管理

Linux 文件权限系统对前端部署非常重要：

```bash
# 查看文件权限
ls -l filename

# 修改权限
chmod 755 filename
chmod +x script.sh  # 增加执行权限

# 改变文件所有者
chown user:group filename
```

## 实用技巧

1. **命令历史**
   ```bash
   ```

history  # 查看命令历史
!100     # 执行历史中第 100 条命令
Ctrl + R # 搜索命令历史

```

2. **管道与重定向**
	```bash
# 将命令输出写入文件
command > output.txt

# 追加到文件
command >> output.txt

# 管道：将一个命令的输出作为另一个命令的输入
ls -l | grep ".js"
```

3. **别名设置**
   ```bash
   ```

# 设置临时别名

alias ll='ls -la'

# 永久生效，添加到~/.bashrc 或~/.zshrc

echo "alias ll='ls -la'" >> ~/.bashrc
source ~/.bashrc  # 立即生效

```

4. **压缩与解压**
	```bash
# 压缩
tar -czvf archive.tar.gz directory/

# 解压
tar -xzvf archive.tar.gz
unzip file.zip
```

掌握这些命令能让你在 Linux 环境下游刃有余，无论是日常开发还是部署运维都能提高效率。建议将常用命令做成 cheat sheet 放在手边，随着使用频率增加，自然会熟能生巧。

记住，`man command` 可以查看任何命令的详细文档，是学习 Linux 命令的最佳途径之一。
