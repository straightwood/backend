const router = require('koa-router')()
const db = require('../db/mysql')

//获得任务列表
router.post('/api/getTaskList', async(ctx, next) => {
  let data = {...ctx.request.body};
  let classId = data.classId;

  let result = await new Promise((resolve, reject) => {
    let sql = `SELECT * FROM task_info WHERE classId = '${classId}'`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  ctx.body = result
})

//获得全部任务完成状态
router.post('/api/taskFinishList', async(ctx, next) => {
  let data = {...ctx.request.body};
  let userId = data.userId;

  let result = await new Promise((resolve, reject) => {
    let sql = `SELECT * FROM task_finish_info WHERE userId = '${userId}'`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  ctx.body = result
})


//获取当前任务
router.post('/api/getCurrentTask', async(ctx, next) => {
  let data = {...ctx.request.body};
  let userId = data.userId;
  
  let temp = await new Promise((resolve, reject) => {
    let sql = `SELECT min(taskId) AS taskId FROM task_finish_info WHERE userId = '${userId}' AND finished = 0;`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  
  let taskId = JSON.parse(JSON.stringify(temp[0].taskId));;
  let result = await new Promise((resolve, reject) => {
    let sql = `SELECT * FROM task_info WHERE taskId = '${taskId}' AND classId=1`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
    ctx.body = result;
})

//当前任务进度比例
router.post('/api/getTaskRate', async(ctx, next) => {
  let data = {...ctx.request.body};
  let userId = data.userId;
  
  let temp = await new Promise((resolve, reject) => {
    let sql = `SELECT max(taskId) AS taskId FROM task_finish_info WHERE userId = '${userId}' AND finished = 1;`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  
  let result = await new Promise((resolve, reject) => {
    let sql = `SELECT totalTasks FROM class_main_info WHERE classId=1`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  let taskId = JSON.parse(JSON.stringify(temp[0].taskId));
  let total = JSON.parse(JSON.stringify(result[0].totalTasks));
  
  let res = Math.round((taskId/total)*10000)/100;
    ctx.body = res;
})


//更新单个任务完成状态
router.post('/api/updateTaskFinishInfo', async(ctx, next) => {
  let data = {...ctx.request.body};
  let userId = data.userId;
  let taskId = data.taskId;
  
  let result = await new Promise((resolve, reject) => {
    let sql = `UPDATE task_finish_info SET finished = 1 WHERE userId = '${userId}' AND taskId = '${taskId}'`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  if(result.affectedRows == 1){
    ctx.body = {msg:'成功'}
  }
})

module.exports = router
