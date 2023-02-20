我正在参与掘金创作者训练营第5期，[点击了解活动详情](https://juejin.cn/post/7123119385803390983 "https://juejin.cn/post/7123119385803390983")

## 前言

熟练的使用 git 指令，是一个程序员的基本功，本文记录了我这些年常用的一些 git 操作。

## 进入新团队需要做的一系列 git 操作

高频使用的指令

```
1. 注册内网 gitLab 账户
2. 项目管理员拉我进项目
3. 有了权限后，git clone 'url' 项目到本地
4. 自己创建新的项目分支 git branch '分支名'
5. 开始编码吧...
6. git clone 默认是下载了所有分支的代码
7. git branch -r 查看项目所有分支
8. git branch -a 查看项目所有远程分支
9. git checkout '分支名' 切换分支
10. git branch 打印出来所有的分支，以及当前所在分支
11. git log 查看提交记录，退出 英文状态下 Q
12. git reflog 可查看修改记录（包括git reset 的回退记录）
13. git reset --hard {commit id} 回退版本
14. git stash //代码放进暂存区(未被commit的代码)
15. git stash apply 还原
16. git stash drop 清除最近一次的stash记录
17. git stash pop 还原并清除最近一次 stash
18. git stash list 查看暂存列表
19. git stash clear 清空所有 stash 的记录
20. git remote -v 显示所有远程仓库
21. git remote add url 添加一个远程仓库
22. git remote rm name # 删除远程仓库
23. git remote rename old_name new_name # 修改仓库名
```

## git 文件名大小写问题

踩了git的坑！！

在 windows下，一开始提交了一个 login.less文件，后来把它重命名为 Login.less，居然提交不了，git 提示没有改动，后来才知道，原来git默认对文件名的大小写不敏感。

如何解决git文件名大小写问题？

### 方案1，配置git

首先可以通过配置git来达到识别文件名大小写的问题。命令如下：

git config core.ignorecase false

缺点是每个仓库都需要修改。

### 方案2，手动修改

1.  首先删除存储在git本地仓库的目标文件，以 Login.less 为例：

```
git rm Login.less 或者
git rm -f Login.less -f 表示强制删除。
```

2.  修改文件名
    
3.  添加文件到本地仓库 git add .
    
4.  提交到本地仓库及远程仓库
    

```
git commit -m 'rename file'; 
git push
```

### git merge 冲突后恢复到合并前状态

```
git merge --abort // 回滚到合并之前

第二种方案：

git stash
git stash clear
```

### 修改 git 仓库的提交用户名和邮箱地址

```
// 查看
git config user.name
git config user.email

// 全局仓库
git config --global user.name "yourName"
git config --glocal uer.email "yourEmail"

// 单个仓库
git config user.name "yourName"
git config user.email "yourEmail"
```

## 取消 Git 对某文件的跟踪 （示： development.env.js）

```
git update-index --assume-unchanged config/development.env.js  可以忽略文件

git checkout .\config\development.env.js

git update-index --no-assume-unchanged .\config\development.env.js 可以取消忽略文件 
```

## 版本回退

解决方法

1、运行git reflog 命令查看你的历史变更记录，如下：

```
fdb70fe HEAD@{0}: pull origin newpbft: Fast-forward
40a9a83 HEAD@{1}: checkout: moving from guan to master
b3fa4c3 HEAD@{2}: commit: copy from newpbft, first init
71bf0ec HEAD@{3}: checkout: moving from newpbft to guan
71bf0ec HEAD@{4}: commit: 1. add moveStore() to clean up certStore and blockStore.
1006d67 HEAD@{5}: commit: 1. Add PBFT branch to Puppeth.
fa3fb56 HEAD@{6}: commit: 1. change some errors about packages and vars
5f40fdc HEAD@{7}: checkout: moving from master to newpbft
40a9a83 HEAD@{8}: clone: from https://github.com/yeongchingtarn/geth-pbft.git
```

2、然后用 git reset --hard HEAD@{n}，（n是你要回退到的引用位置）回退；比如上图可运行 git reset --hard 40a9a83

```
git reset 与 git revert 的区别？

git reset --hard {commitHashId} // 回退到某一个版本
git revert -n {commitHashId} // 回退某一个 commit, 会生成一个新的版本，反转覆盖掉原来的提交代码
```

**注意：关于版本回退记录！！**

一个commit对应这一个版本，有一个commit id，40位的16进制数字，通过SHA1计算得到，不同的文件计算出来的SHA1值不同(有很小的几率相同，可忽略)，这样每一个提交都有其独特的id。每提交一个新版本，实际上 Git 就会把它们自动串成一条时间线。

在Git中，HEAD 表示当前版本，也就是e620a6ff0940a8dff…，HEAD^ 表示上一个版本，HEAD^^ 表示上上一个版本，往上100个版本可以写成HEAD加连续100个 ^ ，也可以写成：HEAD~100

## 拉取远程分支

```
// 拉取远程分支并建立本地分支，但不会自动切换到此本地分支
git fetch origin 远程分支名x:本地分支名x

git checkout -b 本地分支名 origin/远程分支名
```

## 分支合并

```
git merge a 将 a 分支合并到当前分支

注意事项： 
合并分支需要先更新本地分支代码，然后将本地分支1合并到本地分支2，不能直接合并远程分支1到本地分支2
```

## 暂存区

当你需要紧急切换到主分支，执行紧急任务的时候，可以使用

```
git stash // 当前分支代码加入暂存区
git stash list // 查看暂存记录id
git stash apply // 还原
git stash drop 删除最后一条暂存区信息
```

## 修改分支名(重命名)

```
git branch -m oldName newName
```

## 删除本地分支和远程分支

```
1. git branch -d '分支名'
2. git branch -D '分支名' //强制删除
3. git push origin --delete '分支名' // 删除远程分支
```

## 新建本地分支及远程分支

1.  git branch '分支名' //本地新建分支
2.  git fetch origin b1:b2 // 从远程拉取分支 b1 的代码到 本地并新建b2分支

## 查看和修改本地分支和远程分支 关联情况

```
git remote -v // 查看git对应的远程仓库地址
git remote rm origin // 删除关联对应的远程仓库地址
git remote -v // 查看是否删除成功，如果没有任何返回结果，表示OK
git remote add origin https://github.com/developers-youcong/Metronic_Template.git // 重新关联git远程仓库地址
```

## git cherry-pick （摘樱桃）

使用场景：

1.  代码 commit 到错误的分支
2.  转移另一个代码库的提交A

[阮一峰的讲解](http://www.ruanyifeng.com/blog/2020/04/git-cherry-pick.html)

```
在当前分支重新复制提交一份改commit 的代码，生成新的 commitHash

-x 配置项
在提交信息的末尾追加一行(cherry picked from commit ...)，方便以后查到这个提交是如何产生的。

git cherry-pick {commitHashId}

```

## git rebase 和 git merge

rebase 翻译为变基，他的作用和 merge 很相似，用于把一个分支的修改合并到当前分支上, 不同于 git rebase的是，git merge 在不是 fast-forward（快速合并）的情况下，会产生一条额外的合并记录，类似Merge branch 'xxx' into 'xxx'的一条提交信息。

## 取消本地文件修改

#### 1. 未使用 git add 缓存代码时。

可以使用 git checkout -- filepathname (比如： git checkout -- readme.md ，不要忘记中间的 “--” ，不写就成了检出分支了！！)。

放弃所有的文件修改可以使用 git checkout . 命令。

此命令用来放弃掉所有还没有加入到缓存区（就是 git add 命令）的修改：内容修改与整个文件删除。但是此命令不会删除掉刚新建的文件；因为刚新建的文件还没已有加入到 git 的管理系统中。所以对于git是未知的。自己手动删除就好了。

#### 2. 已经使用了 git add 缓存了代码。

可以使用 git reset HEAD filepathname （比如： git reset HEAD readme.md）来放弃指定文件的缓存，放弃所以的缓存可以使用 git reset HEAD . 命令。

此命令用来清除 git 对于文件修改的缓存。相当于撤销 git add 命令所在的工作。在使用本命令后，本地的修改并不会消失，而是回到了如（一）所示的状态。继续用（一）中的操作，就可以放弃本地的修改。

#### 3. 已经用 git commit 提交了代码。

可以使用 git reset --hard HEAD^ 来回退到上一次commit的状态。此命令可以用来回退到任意版本：git reset --hard commitid

你可以使用 git log 命令来查看git的提交历史。git log 的输出如下,之一这里可以看到第一行就是 commitid：

```
commit cf0d692e982d8e372a07aaa6901c395eec73e356 (HEAD -> master)
Author: toyflivver <2440659688@qq.com>
Date:   Thu Sep 28 14:07:14 2017 +0800
    多余的空行
commit 14aa4d7ad4ac6fba59b4b8261d32e478e8cc99ff
Author: toyflivver <2440659688@qq.com>
Date:   Thu Sep 28 14:06:44 2017 +0800
    正常的代码
commit da3a95c84b6a92934ee30b6728e258bcda75f276
Author: toyflivver <2440659688@qq.com>
Date:   Thu Sep 28 13:58:12 2017 +0800
    qbf
commit 267466352079296520320991a75321485224d6c6
Author: toyflivver <2440659688@qq.com>
Date:   Thu Sep 28 13:40:09 2017 +0800
    qbf
```

可以看出现在的状态在 commitid 为 cf0d692e982d8e372a07aaa6901c395eec73e356 的提交上（有 HEAD -> master 标记）。

## Please enter a commit message to explain why this merge is necessary.

请输入提交消息来解释为什么这种合并是必要的

git 在pull或者合并分支的时候有时会遇到这个界面,可以不管(直接下面3,4步)，如果要输入解释的话就需要:

```
1. 按键盘字母 i 进入insert模式

2. 修改最上面那行黄色合并信息,可以不修改

3. 按键盘左上角"Esc"

4. 输入":wq",注意是冒号+wq,按回车键即可
```

## git commit 提交规范

[![image.png](https://camo.githubusercontent.com/b49d6a7355343a4cfa291c5ab732a3f35a836ac703ce60f26da5ed8d201b8af6/68747470733a2f2f70312d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f30373334666365393066643734616631393132313130633833396237306561657e74706c762d6b3375316662706663702d77617465726d61726b2e696d6167653f)](https://camo.githubusercontent.com/b49d6a7355343a4cfa291c5ab732a3f35a836ac703ce60f26da5ed8d201b8af6/68747470733a2f2f70312d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f30373334666365393066643734616631393132313130633833396237306561657e74706c762d6b3375316662706663702d77617465726d61726b2e696d6167653f)

## 修改请求源为内网

[![clipboard.png](https://camo.githubusercontent.com/fe89c0fdf14f91221d3b751a3a148c48e7137aab1a395f6d515c5a7ef3e0dad6/68747470733a2f2f70312d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f61613333393631336533376634396438623135633839363231336232636262657e74706c762d6b3375316662706663702d77617465726d61726b2e696d6167653f)](https://camo.githubusercontent.com/fe89c0fdf14f91221d3b751a3a148c48e7137aab1a395f6d515c5a7ef3e0dad6/68747470733a2f2f70312d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f61613333393631336533376634396438623135633839363231336232636262657e74706c762d6b3375316662706663702d77617465726d61726b2e696d6167653f)

## Git 打标签发布

一般项目发布都有版本号，打标签就是为了记录此时版本下的代码，每次项目发布前给当前代码打上对应标签号，以后可以根据标签号找到任一版本的代码。

相关指令：

### 1. 获取远程标签

```
git fetch --tags // 拉取远程标签
git tag // 查看标签
git fetch origin tag 2.4.10 // 用于精确的拉取指定的某个版本，适合运维同学部署指定版本
```

### 2. 新建标签

```
git tag 2.4.10 //简单方法1
git tag -a 2.4.10 -m 'voc-web version 2.4.10' // 带备注的（常用）
```

### 3. 推送到远程

```
git push origin --tags
```

### 4. 删除标签

```
git tag -d 2.4.10 //删除了本地的2.4.10标签
git push origin :refs/tags/2.4.10 //删除了远程的2.4.10标签
```

## 其他

### npm 常用操作

```
rm -rf node_modules 删除 node_modules目录

rm -rf package-lock.json 删除package-lock.json

npm set registry http://registry.npm.taobao.org 修改 下载仓库为淘宝镜像

npm config set disturl https://npm.taobao.org/dist

npm config set chromedriver_cdnurl
http://cdn.npm.taobao.org/dist/chromedriver

npm set phantomjs_cdnurl http://cdn.npm.taobao.org/dist/phantomjs

npm cache verify 清除 npm 缓存

npm install
```

### 删除 .DS_Store 文件

.DS_Store 是 Finder 用来存储这个文件夹的显示属性的：比如文件图标的摆放位置。虽然有办法可以禁止 .DS_Store 文件的生成，但是没有必要，只需要在 Git 中忽略 .DS_Store 文件即可。

如果你的项目中还没有自动生成的 .DS_Store 文件，那么直接将 .DS_Store 加入到 .gitignore 文件就可以了。如果你的项目中已经存在 .DS_Store 文件，那就需要先从项目中将其删除，再将它加入到 .gitignore。

```
git rm -r --cached .DS_Store

git commit -m 'delete .DS_Store' 

```

发现远程库的 .DS_Store 已经没了。

然后在 gitignore 中忽略即可

### 删除 MERGE_MSG.swp 文件

.swp 文件和 git 无关，在使用 VIM 开始编辑某文件时，都会产生该文件对应的 .swp 文件。正常的退出，VIM 会自动删除此类型文件，非正常退出情况下， VIM 不会删除 ，.swp 文件会作为文件编辑状态的内容备份。

其实多次打开多次不正常关闭，会一直产生 .sw* 文件

第一步：回到合并前状态

```
 git merge --abort  // 中止合并
 rm .git/.MERGE_MSG.sw* //删除 vim 非正常关闭产生的文件
```

第二步：重新合并  
合并提交信息页面，使用 :wq! 或者 :q! 正常退出 VIM ，就能正常合并啦。

### oh-my-zsh 插件

强烈推荐这个插件, 内置了一套简洁的 git 操作快捷指令，使我们操作 git 更快；基于zsh 终端环境，所以需要 mac 系统和 linux 系统。

其内置对快捷指令如下：

```
g - git
gst - git status
gl - git pull
gup - git pull --rebase
gp - git push
gd - git diff
gdc - git diff --cached
gdv - git diff -w "$@" | view
gc - git commit -v
gc! - git commit -v --amend
gca - git commit -v -a
gca! - git commit -v -a --amend
gcmsg - git commit -m
gco - git checkout
gcm - git checkout master
gr - git remote
grv - git remote -v
grmv - git remote rename
grrm - git remote remove
gsetr - git remote set-url
grup - git remote update
grbi - git rebase -i
grbc - git rebase --continue
grba - git rebase --abort
gb - git branch
gba - git branch -a
gcount - git shortlog -sn
gcl - git config --list
gcp - git cherry-pick
glg - git log --stat --max-count=10
glgg - git log --graph --max-count=10
glgga - git log --graph --decorate --all
glo - git log --oneline --decorate --color
glog - git log --oneline --decorate --color --graph
gss - git status -s
ga - git add
gm - git merge
grh - git reset HEAD
grhh - git reset HEAD --hard
gclean - git reset --hard && git clean -dfx
gwc - git whatchanged -p --abbrev-commit --pretty=medium
gsts - git stash show --text
gsta - git stash
gstp - git stash pop
gstd - git stash drop
ggpull - git pull origin $(current_branch)
ggpur - git pull --rebase origin $(current_branch)
ggpush - git push origin $(current_branch)
ggpnp - git pull origin $(current_branch) && git push origin $(current_branch)
glp - _git_log_prettily
```

未完待续！！！

合集：[Github 博客合集](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmingjiezhou%2Fnotes%2Fissues "https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmingjiezhou%2Fnotes%2Fissues")