const {query, pool} = require('../utils/db_util')
const UUID = require('uuid')

exports.getInfoByUserId  = async function (id) {
  const sql = "SELECT id, phone, password, name, avatar_url FROM user_info WHERE id = ?"
  const rows = await query(sql, [id])
  // console.log(rows)
  return rows
}

exports.updateInfo = async function (data, uid) {
  delete data.id, data.create_time, data.modified_time, data.level
  const sql = "UPDATE user_info SET ? WHERE id = " + pool.escape(uid)
  await query(sql, data)
}

exports.register = async function ({phone, password}) {
  const sql = "INSERT INTO user_info SET phone = ?, password = ?"
  await query(sql, [phone, password])
}

exports.getUserUserByPhone = async function (phone) {
  console.log(2)
  const sql = "SELECT * FROM user_info WHERE phone = ?"
  const rows = await query(sql, [phone])
  return rows
}

exports.isExitUser = async function (phone, password) {
  const sql = "SELECT id FROM user_info WHERE phone = ? AND password = ?"
  const rows = await query(sql, [phone, password])
  return rows
}

exports.getTokenByUserId = async function (id) {
  const token = UUID.v1()
  // 判断token表是否已经存在当前用户
  const select_sql = "SELECT * FROM user_token WHERE user_id = ?"
  const idList = await query(select_sql, [id])
  // 存在用户则更新，否则插入
  let update_sql = ''
  if (idList.length > 0) {
    update_sql = "UPDATE user_token SET user_id = ?, token = ?"
  } else {
    update_sql = "INSERT INTO user_token SET user_id = ?, token = ?"
  }
  // 判断结果
  const update_result = await query(update_sql, [id, token])
  return {id, token}
}


exports.isCurrentUser = async function (uid, token) {
  const sql = "SELECT user_id FROM user_token WHERE token = ?"
  const { user_id } = await query(sql, [token])
  if (user_id == uid) {
    return true
  } else {
    return false
  }
}