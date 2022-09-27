---
title: 我眼中的 The Apache Way
date: 2022-03-13
author: tison
description: Apache Community 当中以人为本，极致宽容和着眼技术的理念非常有吸引力。我做得很开心，期待你也加入。
---

大约二十年前我刚开始进入互联网的世界的时候，支撑起整个网络的基础设施，就包括了 Apache 软件基金会（ASF）治下的软件。

[Apache Httpd](https://httpd.apache.org/) 是开启这个故事的软件，巅峰时期有超过七成的市场占有率，即使是在今天 NGINX 等新技术蓬勃发展的时代，也有三成左右的市场占有率。由 Linux、Apache Httpd、MySQL 和 PHP 组成的 LAMP 技术栈，是开源吞噬软件应用的第一场大型胜利。

我从 2018 年参与 [Apache Flink](https://flink.apache.org/) 开始正式直接接触到成立于 1999 年，如今已经有二十年以上历史的 [Apache 软件基金会](https://www.apache.org/)，并在一年后的 2019 年成为 Apache Flink 项目 Committer 队伍的一员，2020 年成为 [Apache Curator](https://curator.apache.org/) 项目 PMC（项目管理委员会）的一员。今年，经由[姜宁](https://github.com/WillemJiang)老师推荐，成为了 [Apache Members](https://www.apache.org/foundation/members.html) 之一，也就是 Apache 软件基金会层面的正式成员。

我想系统性地做一个开源案例库已经很久了。无论怎么分类筛选优秀的开源共同体，The Apache Community 都是无法绕开的。然而，拥有三百余个开源软件项目的 Apache 软件基金会，并不是一篇文章就能讲清楚的案例。本文也没有打算写成一篇长文顾及方方面面，而是启发于自己的新角色，回顾过去近五年在 Apache Community 当中的经历和体验，简单讨论 Apache 的理念，以及这些理念是如何落实到基金会组织、项目组织以及每一个参与者的日常生活事务当中的。

不过，尽管对讨论的对象做了如此大幅度的缩减，由我自己来定义什么是 Apache 的理念未免也太容易有失偏颇。幸运的是，Apache Community 作为优秀的开源共同体，当然做到了我在[《共同创造价值》](https://tisonkun.org/2022/02/10/value-creation/)一文中提到的回答好“我能为你做什么”以及“我应该怎么做到”的问题。Apache Community 的理念之一就是 Open Communications 即开放式讨论，由此产生的公开材料以及基于公开材料整理的文档汗牛充栋。这既是研究 Apache Community 的珍贵材料，也为还原和讨论一个真实的 Apache Community 提出了不小的挑战。

无论如何，本文将以 Apache 软件基金会在 2020 年发布的纪录片 [Trillions and Trillions Served](https://www.youtube.com/watch?v=JUt2nb0mgwg) 为主线，结合其他文档和文字材料来介绍 Apache 的理念。

## 以人为本

纪录片一开始就讲起了 Apache Httpd 项目的历史，当初的 Apache Group 是基于一个源代码共享的 Web Server 建立起来的邮件列表上的一群人。软件开发当初的印象如同科学研究，因此交流源码在近似科学共同体的开源共同体当中是非常自然的。

如同 ASF 的联合创始人 Brian Behlendorf 所说，每当有人解决了一个问题或者实现了一个新功能，他出于一种朴素的分享精神，也就是“为什么不把补丁提交回共享的源代码当中呢”的念头，基于开源软件的协作就这样自然发生了。纪录片中有一位提到，她很喜欢 Apache 这个词和 a patchy software 的谐音，共享同一个软件的补丁（patches）就是开源精神最早诞生的形式。

这是 Apache Community 的根基，我们将会看到这种朴素精神经过发展形成了一个怎样的共同体，在共同体的发展过程当中，这样的根基又是如何深刻地影响了 Apache 理念的方方面面。

Apache Group 的工作模式还有一个重要的特征，那就是每个人都是基于自己的需求修复缺陷或是新增功能，在邮件列表上交流和提交补丁的个人，仅仅只是代表他个人，而没有一个“背后的组织”或者“背后的公司”。因此，ASF 的 [How it Works](https://www.apache.org/foundation/how-it-works.html) 文档中一直强调，在基金会当中的个体，都只是个体（individuals），或者称之为志愿者（volunteers）。

我在某公司的分享当中提到过，商业产品可以基于开源软件打造，但是当公司的雇员出现在社群当中的时候，他应该保持自己志愿者的身份。这就像是开源软件可以被用于生产环境或者严肃场景，例如航空器的发射和运行离不开 Linux 操作系统，但是开源软件本身是具有免责条款的。商业公司或专业团队提供服务保障，而开源软件本身是 AS IS 的。同样，社群成员本人可以有商业公司雇员的身份，但是他在社群当中，就是一个志愿者。

毫无疑问，这种论调当即受到了质疑，因为通常的认知里，我就是拿了公司的钱，就是因为在给这家公司打工，才会去关注这个项目，你非要说我是一个志愿者，我还就真不是一个志愿者，你怎么说？

其实这个问题，同样在 How it Works 文档中已经有了解答。

> All participants in ASF projects are volunteers and nobody (not even members or officers) is paid directly by the foundation to do their job. There are many examples of committers who are paid to work on projects, but never by the foundation itself. Rather, companies or institutions that use the software and want to enhance it or maintain it provide the salary.

我当时基于这样的认识，给到质疑的回答是，如果你不想背负起因为你是员工，因此必须响应社群成员的 issue 或 PR 等信息，那么你可以试着把自己摆在一个 volunteer 的角度来观察和参与社群。实际上，你并没有这样的义务，即使公司要求你必须回答，那也是公司的规定，而不是社群的要求。如果你保持着这样的认识和心态，那么社群于你而言，才有可能是一个跨越职业生涯不同阶段的归属地，而不是工作的附庸。

社群从来不会从你这里索取什么，因为你的参与本身也是自愿的。其他社群成员会感谢你的参与，并且如果相处得好，这会是一个可爱的去处。社群不是你的敌人，不要因为公司下达了离谱的社群指标而把怒火发泄在社群和社群成员身上。压力来源于公司，作为社群成员的你本来可以不用承受这些。

Apache Community 对个体贡献者组成社群这点有多么重视呢？只看打印出来不过 10 页 A4 纸的 How it Works 文档，volunteer 和 individuals 两个词加起来出现了 19 次。[The Apache Way](https://www.apache.org/theapacheway/index.html) 文档中强调的社群特征就包括了 Independence 一条，唯一并列的另一个是经常被引用的 Community over code 原则。甚至，有一个专门的 [Project independence](https://community.apache.org/projectIndependence.html) 文档讨论了 ASF 治下的项目如何由个体志愿者开发和维护，又为何因此是中立和非商业性的。

[INDIVIDUALS COMPOSE THE ASF](https://www.apache.org/foundation/how-it-works.html#hats) 集中体现了 ASF 以人为本的理念。实际上，不止上面提到的 Independence 强调了社群成员个体志愿者的属性，Community over code 这一原则也在强调 ASF 关注围绕开源软件聚集起来的人，包括开发者、用户和其他各种形式的参与者。人是维持社群常青的根本，在后面具体讨论 The Apache Way 的内容的时候还会展开。

## 上善若水

众所周知，[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) (APL-2.0) 是所谓的[宽容式软件协议](https://en.wikipedia.org/wiki/Permissive_software_license)。也就是说，不同于 [GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html) 这样的 Copyleft 软件协议要求衍生作品需要以相同的条款发布，其中包括开放源代码和自由修改从而使得软件源代码总是可以获取和修改的，Apache License 在协议内容当中仅保留了著作权和商标，并要求保留软件作者的任何声明（NOTICE）。

ASF 在软件协议上的理念是赋予最大程度的使用自由，鼓励用户和开发者参与到共同体当中来，鼓励与上游共同创造价值，共享补丁。“鼓励”而不是“要求”，是 ASF 和自由软件基金会（Free Software Foundation, FSF）最主要的区别。

这一倾向可以追溯到 Apache Group 建立的基础。Apache Httpd 派生自伊利诺伊大学的 NCSA Httpd 项目，由于使用并开发这个 web server 的人以邮件列表为纽带聚集在一起，通过交换补丁来开发同一个项目。在项目的发起人 Robert McCool 等大学生毕业以后，Apache Group 的发起人们接过这个软件的维护和开发工作。当时他们看到的软件协议，就是一个 MIT License 精神下的宽容式软件协议。自然而然地，Apache Group 维护 Apache Httpd 的时候，也就继承了这个协议。

后来，Apache Httpd 打下了 web server 的半壁江山，也验证了这一模式的可靠性。虽然有些路径依赖的嫌疑，但是 ASF 凭借近似“上善若水”的宽容理念，在二十年间成功创造了数以百亿计美元价值的三百多个软件项目。

纪录片中 ASF 的元老 Ted Dunning 提到，在他早期创造的软件当中，他会在宽容式软件协议之上，添加一个商用的例外条款。这就像是著名开源领域律师 Heather Meeker 起草的 [The Commons Clause](https://commonsclause.com/) 附加条款。

> Without limiting other conditions in the License, the grant of rights under the License will not include, and the License does not grant to you, the right to Sell the Software.

附加 The Commons Clause 条款的软件都不是符合 OSD 定义的开源软件，也不再是原来的协议了。NebulaGraph 曾经在附加 The Commons Clause 条款的情况下声称自己是 APL-2.0 协议许可的软件，当时的 ASF 董事吴晟就提 issue ([vesoft-inc/nebula#3247](https://github.com/vesoft-inc/nebula/issues/3247)) 指出这一问题。NebulaGraph 于是删除了所有 The Commons Clause 的字样，保证无误地以 APL-2.0 协议许可该软件。

Ted Dunning 随后提到，这样的附加条款实际上严重影响了软件的采用。他意识到自己实际上并不想为此打官司，因此加上这样的条款对他而言是毫无意义的。Ted Dunning 于是去掉了附加条款，而这使得使用他的软件的条件能够简单的被理解，从而需要这些软件的用户能够大规模的采用。“水利万物而不争”，反而是不去强迫和约束用户行为的做法，为软件赢得了更多贡献。

我仍然很敬佩采用 GPL 系列协议发布高质量软件的开发者，Linux 和 GCC 这样的软件的成功改变了世人对软件领域的自由的认识。然而，FSF 自己也认识到需要提出修正的 LGPL 来改进应用程序以外的软件的发布和采用，例如基础库。

APL-2.0 的思路与之不同，它允许任何人以任何形式使用、修改和分发软件，因此 ASF 治下的项目，以及 Linux Foundation 治下采用 APL-2.0 的项目，以及更多个人或组织采用 APL-2.0 的项目，共同构成了强大的开源软件生态，涵盖了应用软件，基础库，开发工具和框架等等各个方面。事实证明，“鼓励”而不是“要求”用户秉持 upstream first 的理念，尽可能参与到开源共同体并交换知识和补丁，共同创造价值，是能够制造出高质量的软件，构建出繁荣的社群和生态的。

## 匠人精神

Apache Community 关注开发者的需要。

Apache Group 成立 ASF 的原因，是在 Apache Httpd 流行起来以后，商业公司和社会团体开始寻求和这个围绕项目形成的群体交流。然而，缺少一个正式的法律实体让组织之间的往来缺乏保障和流程。因此，如同纪录片当中提到的，ASF 成立的主要原因，是为了支撑 Apache Httpd 项目。只不过当初的创始成员们很难想到的是，ASF 最终支撑了数百个开源项目。

不同于 Linux Foundation 是行业联盟，主要目的是为了促进其成员的共同商业利益，ASF 主要服务于开发者，由此支撑开源项目的开发以及开源共同体的发展。

举例来说，进入 ASF 孵化器的项目都能够在 [ASF Infra](https://infra.apache.org/) 的支持下运行自己的 apache.org 域名的网站，将代码托管在 ASF 仓库中上，例如 [Apache GitBox Repositories](https://gitbox.apache.org/repos/asf) 和 [Apache GitHub Organization](https://github.com/apache/) 等。这些仓库上运行着自由取用的开发基础设施，例如持续集成和持续发布的工具和资源等等。ASF 还维护了自己的邮件列表和文件服务器等一系列资源，以帮助开源项目建立起自己的共同体和发布自己的构件。

反观 Linux Foundation 的主要思路，则是关注围绕项目聚集起来的供应商，以行业联盟的形式举办联合市场活动扩大影响，协调谈判推出行业标准等等。典型地，例如 CNCF 一直致力于定义云上应用开发的标准，容器虚拟化技术的标准。上述 ASF Infra 关注的内容和资源，则大多需要项目开发者自己解决，这些开发者往往主要为一个或若干个供应商工作，他们解决的方式通常也是依赖供应商出力。

当然，上面的对比只是为了说明区别，并无优劣之分，也不相互对立。ASF 的创始成员 Brian Behlendorf 同时是 Linux Foundation 下 Open Source Security Foundation 的经理，以及 Hyperledger 的执行董事。

ASF 关注开发者的需要，体现出 Apache Community 及其成员对开发者的人文关怀。纪录片中谈到 ASF 治下项目的开发体验时，几乎每个人的眼里都有光。他们谈论着匠人精神，称赞知识分享，与人合作，以及打磨技艺的愉快经历。实际上，要想从 Apache 孵化器中成功毕业，相当部分的 mentor 关注的是围绕开源软件形成的共同体，能否支撑开源软件长久的发展和采用，这其中就包括共同体成员是否能够沉下心来做技术，而不是追求花哨的数字指标和人头凑数。

讲几个具体的开发者福利。

每个拥有 @apache.org 邮箱的人，即成为 ASF 治下项目 Committer 或 ASF Member 的成员，JetBrains 会提供免费的全家桶订阅授权码。我从 2019 年成为 Apache Flink 项目的 Committer 以后，已经三年沉浸在 IDEA 和 CLion 的包容下，成为彻底使用 IDE 主力开发的程序员了。

Apache GitHub Organization 下的 GitHub Actions 资源是企业级支持，这部分开销也是由 ASF 作为非营利组织募资和运营得到的资金支付的。基本上，如果你的项目成为 Apache 孵化器项目或顶级项目，那么和 GitHub Actions 集成的 CI 体验是非常顺畅的。Apache SkyWalking 只算主仓库就基于 GitHub Actions 运行了十多个端到端测试作业，Apache Pulsar 也全面基于 GitHub Actions 集成了自己的 CI 作业。

提到匠人精神，一个隐形的开发者福利，其实是 ASF 的成员尤其是孵化器的 mentor 大多是经验非常丰富的开发者。软件开发不只是写代码，Apache Community 成员之间相互帮助，能够帮你跟上全世界最前沿的开发实践。如何提问题，如何做项目管理，如何发布软件，这些平日里在学校在公司很难有机会接触的知识和实践机会，在 Apache Community 当中只要你积极承担责任，都是触手可得的。

当然，如何写代码也是开发当中最常交流的话题。我深入接触 Maven 开始于跟 Flink Community 的 Chesnay Schepler 的交流。我对 Java 开发的理解，分布式系统开发的知识，很大程度上也得到了 Apache Flink 和 Apache ZooKeeper 等项目的成员的帮助，尤其是 Till Rohrmann 和 Enrico Olivelli 几位。上面提到的 Ted Dunning 开始攻读博士的时候，我还没出生。但是我在项目当中用到 ZooKeeper 的 multi 功能并提出疑问和改进想法的时候，也跟他有过一系列的讨论。

谈到技艺就会想起人，这也是 ASF 一直坚持以人为本带来的社群风气。

我跟姜宁老师在一年前认识，交流 The Apache Way 期间萌生出相互认同。姜宁老师在 Apache 孵化器当中帮助众多项目理解 The Apache Way 并予以实践，德高望重。在今年的 ASF Members 年会当中，姜宁老师也被推举为 ASF Board 的一员。

我跟吴晟老师在去年认识。他经常会强调开发者尤其是没有强烈公司背景的开发者的视角，多次提到这些开发者是整个开源生态的重要组成部分。他作为 PMC Chair 的 Apache SkyWalking 项目相信“没有下一个版本的计划，只知道会有下一个版本”，这是最佳实践的传播，也是伴随技术的文化理念的传播。SkyWalking 项目出于自己需要，也出于为开源世界添砖加瓦的动机创建的 [SkyWalking Eyes](https://github.com/apache/skywalking-eyes) 项目，被广泛用在不止于 ASF 治下项目，而是整个开源世界的轻量级的软件协议审计和 License Header 检查上。
    
主要贡献在 Apache APISIX 的琚致远同学今年也被推选成为 Apache Members 的一员。他最让我印象深刻的是在 APISIX 社群当中积极[讨论社群建设的议题](https://lists.apache.org/thread/40spln9t62dz8dlwf0xg174g131t89fq)，以及作为 APISIX 发布的 GSoC 项目的 mentor 帮助在校学生接触开源，实践开源，锻炼技艺。巧合的是，他跟我年龄相同，于是我痛失 Youngest Apache Member 的噱头，哈哈。

或许，参与 Apache Community 就是这样的一种体验。并不是什么复杂的叙事，只是找到志同道合的人做出好的软件。我希望能够为提升整个软件行业付出自己的努力，希望我（参与）制造的软件创造出更大的价值，这里的人看起来大都也有相似的想法，这很好。仅此而已。

原本还想聊聊 The Apache Way 的具体内容，还有介绍 Apache Incubator 这个保持 Apache Community 理念常青，完成代际传承的重要机制，但是到此为止似乎也很好。Apache Community 的故事和经验很难用一篇文章讲完，这两个话题就留待以后再写吧。
