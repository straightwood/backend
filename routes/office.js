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



module.exports = router