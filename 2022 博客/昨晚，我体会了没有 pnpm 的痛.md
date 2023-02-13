课题：

1.  如果没有U盘，window 和 mac 本地计算机之间如何传输大量文件？
2.  为什么要用 pnpm？硬链接、软链接是什么？

### 起因

事情是这样的，最近自己的办公设备，从thinkpad 更换到了macbook pro14，因为m1 芯片的强悍性能，工作效率都有了很大提升，甚至每天背着回家都不嫌累了，这不，昨晚照常早早的回到家，做好饭，打开电脑看着电影，突然想起来之前电脑上还有很多项目代码没迁移，gitlab 上的就不说了，直接clone 下就好了，剩下的都是一些历史项目老代码绝版的～，手头有U盘和移动硬盘但是 mac 没有 usb 接口，转接头也在公司，而且这个硬盘还不能直接供mac 访问，还要用额外的软件处理格式。。，嗯想了一下，手头可行的方案大概有这些。

#### 快传网站

之前偶尔用过[奶牛快传](https://cowtransfer.com/)来传输压缩包文件，当时是因为内网原因某些 npm 包下不下来，所以同事用这个网站传给我的，不过那个太慢来，限制也多，而且这种方案都要把自己文件走一遍他们服务器的，不适合传输隐私文件，不太行。pass

#### 局域网共享

我记得一般公司内网都有局域网共享，来存储访问共享文件夹，而且可操作复制到本地，那么 mac 和window 之间是否支持这种方式呢？一通查找下来发现也是可以的（开心），那么就试一下看看吧。

首先，保证window 和 mac 设备在同一个网络下，最简单就是连接同一个 wifi,找到要共享的文件夹，右击 => 属性 => 共享 => 勾选“共享此文件夹” => 选择共享用户，默认 Everyone => 应用、确认。到这一步，该文件夹就被配置为共享文件夹了，在当前局域网内的其他设备均可以通过此设备的 ip + 用户账号密码来进行访问了。

mac 下打开 Finder(访达), 菜单栏 => 前往 => 连接服务器 => 输入 smb://ip地址 => 连接 => 如果链接成功则需要输入设备账号密码来进行验证，通过后就会在Finder 的侧边栏看到一个新的设备选项了，打开就能看到之前共享的文件夹了，可以像普通文件一样来访问和移动。

[![未标题-2 拷贝](https://user-images.githubusercontent.com/37775265/154394138-9a25e65e-46c5-41e5-a72d-d380d31f8bd5.png)](https://user-images.githubusercontent.com/37775265/154394138-9a25e65e-46c5-41e5-a72d-d380d31f8bd5.png)

[![截屏2022-02-08 22 27 53](https://user-images.githubusercontent.com/37775265/154394221-2985fdfe-c773-4bb1-a4f2-8f2682616c14.png)](https://user-images.githubusercontent.com/37775265/154394221-2985fdfe-c773-4bb1-a4f2-8f2682616c14.png)

事情到这里我以为可以愉快到复制粘贴了，然而发现项目实在太多，大大小小几十个，最糟心到是很多项目里都有node_modules 文件夹，代码才几M，node_modules 却有 200+M,这些包文件因为没能复用，所以基本上每个项目都单独保存了一份，好吧，现在只能先把 node_modules 删除掉了，然后再移动项目代码，这样就很快了。

本来以为事情已经完美结束了，今天却发现一个意外的问题，用过 M1 的同学可能听说过 ssd swap 这个概念，它是 macos 系统同内存规格下比 window 系统更加流畅的原因之一，当系统应用占用过多，内存不够时 window 会有明显的卡顿，macOS 系统却好很多，因为此时它会将暂时不用的应用缓存从内存中转移到 ssd 中，给内存腾出空间。

这个过程是无感知的所以你会发现明明开启了多个大型应用理论上早就超出了内存大小，可是依然不会有明显的卡顿，就是这个原因，特别是随着 ssd 性能的增强以及M1 芯片架构的改变，这个特性被更好的使用了，一方面这是个好事情，充分利用了ssd 性能以更小的内存换来比以往更好的使用体验，但是事情都是有两面性的，swap 的原理意味着它将带来更大的ssd 读写量，而一般 ssd 是有使用寿命的，也就是它的全盘写入次数是有上限的。

硬盘的寿命一般用 TBW （最大写入量）来表示，1T 规格的 ssd固态通常标称的保修寿命为 600TBW，也许你注意到了这里说的是保修寿命而不是使用寿命，是的反正大家都说实际寿命要远远大于保修寿命，谁知道呢。我就姑且按照 1T 600TBW 来算，我512GB 的硬盘就是 300TBW 的标称写入量，本来这是足够用的了，按照普通人的使用习惯，甚至我作为开发人员办公加日常娱乐全天10小时的使用强度来说用个10年都没问题，这是我根据过去50天来的使用习惯统计而来的，最近一次统计是2月1号，平均每个月3T, 3*12 = 36T/年，将近十年的寿命。

但是昨晚一通操作之后，今天在公司查了一遍发现 swap量在一周内增加了 6T（1T==1024GB），很恐怖哎,实在想不明白，怀疑是昨晚文件操作引起的数据读写激增，可能性还是挺大的，一是我没有对文件进行压缩，所以磁盘要读取文件数量并且串行处理，比单个压缩文件要消耗磁盘；二是node_modules 文件可能有遗漏的没有删除 那里面文件居多树形组织复杂度很高，对文件的索引建立过程肯定也很消耗磁盘。

怀疑归怀疑，但是这6T 的大小也实在是匪夷所思 我的项目虽然多但是 1G 都不到的，swap 能达到 6144G 就很神奇，罢了罢了，暂时没有眉目，先记录下来。

[![image](https://user-images.githubusercontent.com/37775265/154394325-857f167f-68c7-4963-80b1-62160db47ab3.png)](https://user-images.githubusercontent.com/37775265/154394325-857f167f-68c7-4963-80b1-62160db47ab3.png)

### 为什么是 pnpm

当时我就在想，如果我的项目都用的 pnpm 来管理的包，node_modules 只完整的保存了一份，当需要批量备份代码的时候就直接压缩个包就行了，不需要再单独删除每个项目缓存的包文件了，省心很多啊。

### pnpm 是怎么做到的

这就要涉及文件系统中两个概念：硬链接、软链接；

#### 硬链接

在Linux的文件系统中，保存在磁盘分区中的文件不管是什么类型都给它分配一个编号，称为索引节点号(Inode Index)，在 Linux 中，允许多个文件名指向同一索引节点，一般这种连接就是硬链接。

硬链接的作用是允许一个文件拥有多个有效路径名，这样用户就可以建立硬链接到重要文件，以防止“误删”的功能。其原因如上所述，因为对应该目录的索引节点有一个以上的链接。只删除一个链接并不影响索引节点本身和其它的链接，只有当最后一个链接被删除后，文件的数据块及目录的链接才会被释放。也就是说，文件真正删除的条件是与之相关的所有硬链接文件均被删除。

语法：ln filename [linkname ]

1.  硬链接的新建是为同一inode号添加文件名 （本质是在目录条目里为inode号增添一个文件名映射，指向同一个inode表数据，因此数据相同）
2.  新建硬链接，链接数增加（链接数实质就是 inode号 对应文件名的个数；当 inode 号映射的文件名不存在时，此 inode号就会被系统回收重用）
3.  硬链接文件和原文件之间数据共享，但又互相独立；（修改其中任意一个文件的数据，其他的文件数据都会改变，删除硬链接文件则对应的链接数会减少，如果是最后一个链接数则直接删除文件。）
4.  不能跨分区和跨设备创建硬链接
5.  不能对目录创建硬链接 （目录最多有三个硬链接，目录本身，目录下的 . ，子目录下的 …）

**示例**：  
以下命令建议在 Linux 虚拟机中或 MacOS 中操作：

```
1. 新建 poetryFile 文件
$ touch poetryFile

2. 给文件输入内容'人生得意须尽欢'
$ echo '人生得意须尽欢'>poetryFile
$ cat poetryFile // 查看内容

3. 通过ln 在同文件路径下建立硬链接文件 hardPoetryFile
$ ln poetryFile hardPoetryFile

4. 修改被硬链接的文件,加上'莫使金樽空对月'
$ echo '莫使金樽空对月'>>hardPoetryFile
$ cat poetryFile
```

#### 软链接

有点像是 window 中的快捷方式，它本身也是一个文件，只不过保存的是它指向的文件的全路径，访问时将通过它访问所指向的文件路径以打开指定文件，所以当删除源文件时，打开它将报错指示无相关路径。

语法：ln -s filename [linkname ]

1.  软链接实质是新建一个文件快捷方式，存放的数据是原文件的文件名，文件数据大小是原文件名字的字节数；访问时通过文件名指向到原文件数据
2.  软链接支持跨分区
3.  可以创建目录软链接
4.  软链接文件依赖于原始文件 ；删除原始文件，软链接文件会失效

**示例**：  
在 poetryFile 的基础上我们新建一个软链接

```
$ ln -s poetryFile softPoetryFile // 新建软链接文件
$ cat softPoetryFile // 查看文件内容
人生得意须尽欢，莫使金樽空对月
$ echo '天生我材必有用'>>softPoertFile // 修改软链接内容

$ cat softPoertFile // softPoertFile内容变化
人生得意须尽欢，莫使金樽空对月; 天生我材必有用
```

在文件当前所在目录通过 ls -hl 查看信息,可以发现硬链接文件和源文件各种信息均一致，可以说是一样的文件，而软链接文件则只是存储了指向信息，所以可以看到明显的差别。

total 16
-rw-r--r--@ 2 zhoumingjie  staff    66B  2  9 10:24 hardPoetryFile
-rw-r--r--@ 2 zhoumingjie  staff    66B  2  9 10:24 poetryFile
lrwxr-xr-x  1 zhoumingjie  staff    10B  2  9 10:21 softPoetryFile -> poetryFile

#### pnpm对硬链接，软链接的运用

> 当使用 npm 或 Yarn 时，如果你有100个项目使用了某个依赖（dependency），就会有100份该依赖的副本保存在硬盘上。而在使用 pnpm 时，依赖会被存储在内容可寻址的存储中，所以：  
> 如果你用到了某依赖项的不同版本，那么只会将有差异的文件添加到仓库。 例如，如果某个包有100个文件，而它的新版本只改变了其中1个文件。那么 pnpm update 时只会向存储中心额外添加1个新文件，而不会因为仅仅一个文件的改变复制整新版本包的内容。  
> 所有文件都会存储在硬盘上的某一位置。 当软件包被被安装时，包里的文件会==硬链接==到这一位置，而不会占用额外的磁盘空间。 这允许你跨项目地共享同一版本的依赖。  
> 因此，您在磁盘上节省了大量空间，这与项目和依赖项的数量成正比，并且安装速度要快得多！

[![node-modules-structure-8ab301ddaed3b7530858b233f5b3be57](https://user-images.githubusercontent.com/37775265/154394398-301d170d-c6c9-4fc3-adb3-f708f9191d9a.jpg)](https://user-images.githubusercontent.com/37775265/154394398-301d170d-c6c9-4fc3-adb3-f708f9191d9a.jpg)  
摘自： [https://pnpm.io/zh/motivation](https://pnpm.io/zh/motivation)

在pnpm 出现之前，npm 和 yarn 为了提升装包效率以及复用率，采用了扁平化对策略，也就是所有的依赖包都装到根目录下，这样会导致node_modules 下的包和 package.json 中定义的存在很大出入，这会引起幽灵依赖（ 幽灵依赖” 指的是项目中使用了一些没有被定义在其package.json 文件中的包。）

如图：  
[![截屏2022-02-09 13 22 51-1](https://user-images.githubusercontent.com/37775265/154394914-c534a162-1b23-488c-b90d-ac4f110dea18.png)](https://user-images.githubusercontent.com/37775265/154394914-c534a162-1b23-488c-b90d-ac4f110dea18.png)

虽然我只需要express 这一个包，但是experss 所依赖的包都被平铺到了根目录，这将导致我可以直接使用这些没在 package.json 中定义的包，虽然项目可以运行，但是将是个潜在的隐患。

而如果使用 pnpm, 它将使用软链接来解决这个问题：  
[![截屏2022-02-09 13 34 23](https://user-images.githubusercontent.com/37775265/154395023-ba6a5659-7b57-4799-954d-1c18ebe1bbaf.png)](https://user-images.githubusercontent.com/37775265/154395023-ba6a5659-7b57-4799-954d-1c18ebe1bbaf.png)

可以看到，node_modules 下结构和我们期望的几乎一样了，很简洁，之前的那些包被放到了 .pnpm 里,其实这里的 express 就是个软链接，执行 `ls -hl` 查看其详细信息, 可以看到它指向了 .pnpm 下的express 文件，所以说 pnpm 的软链接就是将 node_modules 里的文件软链接到对应的 .pnpm/[package_name]@version/node_modules/[package_name] 中。

```
total 0
lrwxr-xr-x  1 zhoumingjie  staff    41B  2  9 13:29 express -> .pnpm/express@4.17.2/node_modules/express
lrwxr-xr-x  1 zhoumingjie  staff    47B  2  9 13:29 mime-types -> .pnpm/mime-types@2.1.34/node_modules/mime-types
```

而 .pnpm 中的文件则是一个对源文件的硬链接，我来验证下，首先找到 pnpm-test 项目下找到 express 的文件路径，通过终端指令 `stat -s index.js`读取其详细信息，发现其 index.js inode节点为 st_ino=5206568 并且有8个相同的硬链接，然后建一个新项目，并安装express,发现 其节点inode 仍然是st_ino=5206568，但是硬链接数量增加到了 9 个，可以看出express 下的index.js 实际上是被复用的。

[![截屏2022-02-09 13 59 32](https://user-images.githubusercontent.com/37775265/154395079-150cc9e3-9724-49d8-ab9c-539539f2fb20.png)](https://user-images.githubusercontent.com/37775265/154395079-150cc9e3-9724-49d8-ab9c-539539f2fb20.png)

那么，pnpm 下载的源文件到底在哪里呢，以 macOS 为例，会默认安装到当前用户的根目录下，是一个隐藏文件，你也可以通过修改配置来更换其位置 `pnpm config set store-dir /path/to/.pnpm-store`

[![截屏2022-02-09 14 23 55](https://user-images.githubusercontent.com/37775265/154395098-053117d6-9ff4-42f8-b374-951380de34b3.png)](https://user-images.githubusercontent.com/37775265/154395098-053117d6-9ff4-42f8-b374-951380de34b3.png)

### 总结：

pnpm == p(performant) + npm,代表高性能的 npm，我觉得目前可用性已经很好了，虽然可能迁移中会遇到一些问题比如幽灵依赖，但是还是值得升级的。特别是新项目，无脑用起来吧。

参考链接：  
[pnpm文档](https://pnpm.io/zh/motivation)  
[linux中文件索引节点知识](https://blog.51cto.com/u_13449039/2395301)  
[Linux软连接和硬链接](https://www.cnblogs.com/itech/archive/2009/04/10/1433052.html)  
[从软链接&硬链接理解前端包管理工具](https://juejin.cn/post/7056581097429139463#heading-2)