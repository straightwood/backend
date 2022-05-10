const router = require('koa-router')()
const db = require('../db/mysql')

//获得视频列表
router.post('/api/getVideoList', async(ctx, next) => {
  let data = {...ctx.request.body};
  let classId = data.classId;

  let result = await new Promise((resolve, reject) => {
    let sql = `SELECT * FROM video_info WHERE classId = '${classId}'`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  ctx.body = result
})

//视频是否已经学习
router.post('/api/getVideoLearnInfo', async(ctx, next) => {
  let data = {...ctx.request.body};
  let userId = data.userId;

  let result = await new Promise((resolve, reject) => {
    let sql = `SELECT * FROM video_learn_info WHERE userId = '${userId}'`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  ctx.body = result
})

//更新视频学习状态
router.post('/api/updateVideoLearnInfo', async(ctx, next) => {
  let data = {...ctx.request.body};
  let userId = data.userId;
  let videoId = data.videoId;
  
  let result = await new Promise((resolve, reject) => {
    let sql = `UPDATE video_learn_info SET learned = 1 WHERE userId = '${userId}' AND videoId = '${videoId}'`
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
