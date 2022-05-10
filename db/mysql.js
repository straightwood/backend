const mysql      = require('mysql')

// 创建数据池
const pool  = mysql.createPool({
    host     : 'localhost', 
    user     : 'root',    
    password : 'w971810648',   
    database : 'test'  
})

//请求封装
function query (sql, callback) {
  pool.getConnection((err, connection) => {
    connection.query(sql, (err, rows) => {
      callback(err, rows)
      // 中断连接
      connection.release()
    })
  })
}

exports.query = query
