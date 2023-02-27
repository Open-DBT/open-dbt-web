<p align="center">
	<img alt="logo" height="100" width="300" src="./image/logo-black.png">
</p>


<h4 align="center">基于SpringBoot+React+Postgresql前后端分离的数据库实训平台</h4>
<p align="center">
	<a href="https://github.com/Open-DBT/open-dbt-web"><img src="https://img.shields.io/badge/opendbt-v2.0.0-brightgreen.svg"></a>
	<a href="https://github.com/Open-DBT/open-dbt-web/blob/master/LICENSE"><img src="https://img.shields.io/github/license/mashape/apistatus.svg"></a>
</p>



## 项目说明

* 数据库实训平台是一个既能满足普通课程教学又能支撑起数据库系列课程教学的平台。
  主要用于各学校教师学生的教学和学习，也可用于公司或个人的培训、考试、练习。
  数据库实训平台不仅能够对普通客观题型（选择题、填空题、判断题等）进行自动评判，计算得分，而且能够对PostGresql数据库DML题型进行自动评判,计算得分。
  基于SpringBoot+React+Postgresql前后端分离的数据库实训平台,支撑起数据库系列课程及其他课程的教学。教师端在平台进行备课、教学、出题、发布作业、批改作业、查看学习进度等，学生端可在此平台进行上课学习、完成作业，使用该平台可提升课程质量和教学效率。整个教学过程可进行可持续的改进和优化，最终打造成一个一站式教学资源的整合平台。
* 前端采用React、antd-pro、ts
* 后端采用Spring Boot、Mybatis-Plus、Jwt
* 权限认证使用Jwt安全可控
* 支持Postgresql数据库
* 后端地址: https://github.com/Open-DBT/open-dbt


## 内置功能

* 用户管理: 完成平台用户的配置管理
* 角色管理: 角色权限分配
* 模块管理: 功能模块显示查询及各模块显示设置
* 个人设置: 设置个人信息，修改个人密码
* 意见反馈: 搜集用户意见
* 我的课程: 当前用户下的课程
* 课程模板: 课程专家和教师用户个人的课程模板，用于说明本学期开设的课程
* 班级: 当前教师角色下所有的班级信息，新建班级
* 介绍: 进入课程后的课程信息
* 章节: 用于教师备课、授课、编辑课程内容、统计学生学习进度，学生角色查看学生任务、个人学习进度统计、课程学习
* 知识: 该课程下知识点展示
* 题库: 用于教师端出题
* 作业: 用于教师端新建作业、发布作业、批改作业、查看学生作业情况

## 在线体验

* 演示地址：http://124.133.18.222:59005/user/login
* 账号密码: admin/admin
* 文档地址：https://github.com/Open-DBT/open-dbt/wiki

## 项目结构

```
─src
  │  └─pages
  │      └─img						图片静态资源
  │      ├─home						主页
  |		 ├─user					登录页
  │      ├─feedback                                  	反馈
  │      ├─sys                                  	管理页面展示
  │      ├─course                                  	课程模板
  │      ├─expert                                  	课程列表
  │      ├─common-course                                 
  │      │          └─chapter				教师端章节模块
  │      |          ├─task                              教师端作业模块
  │      |          ├─question                          教师端题库模块
  │      |          ├─scence                          	场景
  │      |          └─scence_new    
  │      ├─publicLib                                    公共库
  │      ├─teacher                                    	教师模块
  │      ├─sclass                                    	班级模块 
  │      ├─stu                                    	学生模块
  │      ├─center                                    	个人中心
  │      └─webapp                                       静态资源信息
  │  ├─services						接口
  │  ├─common						定义实体对象
  │  ├─config				
  │      └─routes					路由
  
```

## 技术选型

- 项目框架：Ant Design Pro基于React的实现版本
- 技术栈：React + React-Hooks + TypeScript + Ant-Design

## 本地部署

### 开发环境搭建

* 1.git源码下载
  <br />&emsp;`git clone git@github.com:Open-DBT/open-dbt-web.git`
* 2.node环境安装(可以安装yarn方便快速下载依赖)
  <br />&emsp;node官网:https://nodejs.org/en/download/
* 3.yarn安装(用npm安装): 
  <br />&emsp;`npm install -g yarn` 
   <br />&emsp;`yarn --version`      // 查看版本 
* 4.安装项目依赖
  <br />&emsp;`yarn install`
* 5.启动项目
  <br />&emsp;`yarn start`
* 6.在app.tsx、public下的iframe文件夹的pdfView.html、video.html和videoPlay.html中找到对应的url，<br/>修改后端地址进行数据交互。
### 部署

* 打包项目：`yarn build`

### 访问

* 部署启动后端项目，请参考后端相关文档，后端项目地址：https://github.com/Open-DBT/open-dbt
* 登录地址: http://XXXX:XX/user/login
* 账号密码：admin/admin, js/js

## 如何贡献

* 提交一个问题或者功能, 请在提交前进行验证.
* 审阅 网站 ，对于任何拼写错误或者内容建议，请创建 pull requests
