const router = require('koa-router')()
const db = require('../db/mysql')

//获得个人身份信息 - 姓名 学校
router.post('/api/userInfo', async(ctx, next) => {
  let data = {...ctx.request.body};
  let userId = data.userId;

  let result = await new Promise((resolve, reject) => {
    let sql = `SELECT name,school FROM user WHERE userId = '${userId}'`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  ctx.body = result
})

//获得课程信息
router.post('/api/userClassInfo', async(ctx, next) => {
  let data = {...ctx.request.body};
  let userId = data.userId;

  //获得学习的课程代码数组
  let temp = await new Promise((resolve, reject) => {
    let sql = `SELECT class_one_id,class_two_id,class_three_id FROM user WHERE userId = '${userId}'`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  let obj = JSON.parse(JSON.stringify(temp[0]));
  let arr = [];
  for (let o in obj) {
    arr.push(obj[o]);
  }
  //批量查询
  let result = await new Promise((resolve, reject) => {
    let sql = `SELECT className,picUrl FROM class_main_info WHERE classId in ('${arr[0]}','${arr[1]}','${arr[2]}')`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  ctx.body = result
})

module.exports = router