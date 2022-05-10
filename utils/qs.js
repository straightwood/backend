// 将对象转换成mysql更新字符串函数
function stringify(obj,config={}) {
  let {likeArr=[]}=config
  if(!(obj instanceof Object)){
      console.error(`${obj}数据格式错误`)
      return
  }
  let qsStr=''
  for (let i in obj){
      let connectStr='='
      let valueGuard=""
      if(likeArr.includes(i)){
          //模糊查询
          connectStr=' like '
          valueGuard=`%`
      }
      let value=typeof obj[i]==='number' ? obj[i] : `'${valueGuard}${obj[i]}${valueGuard}'`
      if(!value && value!==0){
          //没有值的不做拼接
          continue
      }
      qsStr+=`,${i}${connectStr}${value}`
  }
  qsStr=qsStr.replace(',','')
  console.log(qsStr)
  return qsStr
}
// 将mysql更新字符串函数解析成对象
function parse(str,config={}) {
  if(typeof str !=='string'){
      console.error(`${str}数据格式错误`)
      return
  }
  let {likeArr=[]}=config
  let strArr=str.split(',')
  return strArr.reduce((result,current)=>{

      let likeIndex=likeArr.findIndex(item=>new RegExp(`^${item}`).test(current))
      let connectStr=likeIndex>-1 ? ' like ' : '='
      let itemArr=current.split(connectStr)
      if(likeIndex>-1){
          result[itemArr[1]]=result[itemArr[1]].replaceAll('%','')
      }
      result[itemArr[0]]=result[itemArr[1]]
      return result
  },{})
}
module.exports={
  stringify,
  parse
}