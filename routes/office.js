const router = require('koa-router')()
const db = require('../db/mysql')

//建筑对应课程id查询
router.post('/api/buildingClass', async(ctx, next) => {
  let data = {...ctx.request.body};
  let buildingName = data.buildingName;
  //查询
  let result = await new Promise((resolve, reject) => {
    let sql = `SELECT building_class FROM building WHERE building_name = '${buildingName}'`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  let res = JSON.parse(JSON.stringify(result));
  ctx.body = res
})

//建筑对应的课程信息
router.post('/api/getCurrentClass', async(ctx, next) => {
  let data = {...ctx.request.body};
  let classId = data.classId;
  //查询
  let result = await new Promise((resolve, reject) => {
    let sql = `SELECT * FROM class_main_info WHERE classId = '${classId}'`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  let res = JSON.parse(JSON.stringify(result));
  ctx.body = res
})


//新用户进入建筑之后信息初始化
// 进入后默认开始学习课程，初始化该用户的课程信息
router.post('/api/userClassInit', async(ctx, next) => {
  let data = {...ctx.request.body};
  let userId = data.userId;
  let classId = data.classId;
  
  //查询一共有多少条视频
  let result = await new Promise((resolve, reject) => {
    let sql = `SELECT totalVideos FROM class_main_info WHERE classId = '${classId}'`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  let total = JSON.parse(JSON.stringify(result[0].totalVideos));
  console.log(total)

  //添加视频记录
  for(let i = 1; i<=total; i++){
    await new Promise((resolve, reject) => {
      let sql = `INSERT INTO video_learn_info (userId,videoId,learned) VALUES ('${userId}','${i}',0)`
      return db.query(sql, (err, data) => {
        if (err) throw err;
        resolve(data)
      })
    })
  }
  ctx.body = {msg:'成功'}
})

// 进入后初始化该用户的任务信息
router.post('/api/userTaskInit', async(ctx, next) => {
  let data = {...ctx.request.body};
  let userId = data.userId;
  let classId = data.classId;
  
  //查询一共有多少任务
  let result = await new Promise((resolve, reject) => {
    let sql = `SELECT totalTasks FROM class_main_info WHERE classId = '${classId}'`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  let total = JSON.parse(JSON.stringify(result[0].totalTasks));

  //初始化任务记录
  for(let i = 1; i<=total; i++){
    await new Promise((resolve, reject) => {
      let sql = `INSERT INTO task_finish_info (userId,taskId,finished) VALUES ('${userId}','${i}',0)`
      return db.query(sql, (err, data) => {
        if (err) throw err;
        resolve(data)
      })
    })
  }
  ctx.body = {msg:'成功'}
})



module.exports = router