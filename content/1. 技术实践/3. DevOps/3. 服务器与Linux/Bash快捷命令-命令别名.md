---
title: Bash快捷命令/命令别名
date: 2025-08-08T00:12:24+08:00
updated: 2025-08-08T00:55:02+08:00
---

# Bash 快捷命令/命令别名

众所周知，每次提交 pr 以后，想要更新代码，都要通过 amend 和强推命令更新远程仓库的个人分支。

一遍一遍的 `git commit --amend --noedit`，再 `git push -f`，让人十分头痛。

从程序员的角度上来说，偷懒是每一位程序员进步不可缺少的自驱力。所以我们可以通过配置 bash alias 的方式简化命令！

首先找到 C:/Program Files/Git/etc/profile.d/aliases.sh，用吃饭的家伙打开这个 shell 文件，git 默认会把 bash 安装到这个地方。

然后就会看到最上面的代码长这样，内置了一些别名命令

```bash
# --show-control-chars: help showing Korean or accented characters
alias ls='ls -F --color=auto --show-control-chars'
alias ll='ls -l'
```

我们就可以在下面追加，例如

```bash
alias ga='git add '
alias gd='git diff '
alias gc='git commit'
alias gca='git commit --amend'
alias gs='git status'
alias gl='git log'
alias gb='git branch'
alias gba='git branch -a'
alias gco='git checkout '
alias gcb='git checkout -b'
alias gp='git pull '
alias gpr='git pull --rebase'
alias gss='git stash save '
alias gsp='git stash pop '
alias gsl='git stash list '
alias gsc='git stash clear '
alias gf='git fetch '
alias gpv='git push '
alias gr='git reset '
alias grh='git reset --soft HEAD~1 '
alias glo='git log --oneline --all --graph --decorate $*'
alias gcae='git commit --amend --no-edit'
alias gpf='git push -f'
```

然后 ctrl+s 管理员模式保存，重启一下终端，就可以愉快的玩耍了
