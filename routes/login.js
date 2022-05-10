const router = require('koa-router')()
const db = require('../db/mysql')

// 登录
router.post('/api/login', async(ctx, next) => {
  let data = {...ctx.request.body};
  let username = data.username;
  let password = data.password;

  let result = await new Promise((resolve, reject) => {
    let sql = `SELECT userId FROM user WHERE name='${username}'and password='${password}'`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  ctx.body = result
})


//注册
router.post('/api/register', async(ctx, next) => {
  let data = {...ctx.request.body};
  let username = data.username;
  let password = data.password;
  
  //查询用户名是否存在
  let result = await new Promise((resolve, reject) => {
    let sql = `SELECT * FROM user WHERE name='${username}'`
    return db.query(sql, (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  let res = JSON.parse(JSON.stringify(result));

  //用户名不存在，注册, 返回userId
  if(res.length == 0){
    console.log('no')
    await new Promise((resolve, reject) => {
      let sql = `INSERT INTO user (name,password) VALUES ('${username}','${password}')`
      return db.query(sql, (err, data) => {
        if (err) throw err;
        resolve(data)
      })
    })
    let result = await new Promise((resolve, reject) => {
      let sql = `SELECT userId FROM user WHERE name='${username}'`
      return db.query(sql, (err, data) => {
        if (err) throw err;
        resolve(data)
      })
    })
    let res = JSON.parse(JSON.stringify(result));
    ctx.body = res
    
  }else{
    ctx.body = {"msg":"用户名已存在"}
  }
})


module.exports = router
