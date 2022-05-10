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
    let sql = `UPDATE * FROM video_learn_info WHERE userId = '${userId}'`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  ctx.body = result
})





module.exports = router
