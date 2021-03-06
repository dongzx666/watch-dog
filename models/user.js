const {query, pool} = require('../utils/db_util')
const UUID = require('uuid')

exports.getInfoByUserToken  = async function (token) {
  const sql = "SELECT id, phone, name, avatar_url FROM user_info WHERE token = ?"
  const rows = await query(sql, [token])
  return rows
}

exports.updateInfoByToken = async function (data, token) {
  const sql = "UPDATE user_info SET ? WHERE token = ?"
  await query(sql, [data, token])
}

exports.updateInfoByPhone = async function (data, phone) {
  const sql = "UPDATE user_info SET ? WHERE phone = ?"
  await query(sql, [data, phone])
}

exports.register = async function ({phone, password}) {
  const sql = "INSERT INTO user_info SET phone = ?, password = ?, alias = ?"
  await query(sql, [phone, password, phone])
}

exports.registerDevice = async (user_id, device_id) => {
  const sql = "INSERT INTO user_device SET user_id = ?, device_id = ?"
  await query(sql, [user_id, device_id])
}

exports.getUserByPhone = async function (phone) {
  console.log(2)
  const sql = "SELECT * FROM user_info WHERE phone = ?"
  const rows = await query(sql, [phone])
  return rows
}

exports.isExitUser = async function (phone) {
  const sql = "SELECT id, password FROM user_info WHERE phone = ?"
  const rows = await query(sql, [phone])
  return rows
}

exports.isRegisteredDevice = async (device_id) => {
  const sql = "SELECT user_id FROM user_device WHERE device_id = ?"
  const rows = await query(sql, [device_id])
  return rows
}

exports.getDeviceByUser = async (user_id) => {
  const sql = "SELECT device_id FROM user_device WHERE user_id = ?"
  const rows = await query(sql, [user_id])
  return rows
}

// exports.getTokenByUserId = async function (id) {
//   const token = UUID.v1()
//   // 判断token表是否已经存在当前用户
//   const select_sql = "SELECT * FROM user_token WHERE user_id = ?"
//   const idList = await query(select_sql, [id])
//   // 存在用户则更新，否则插入
//   let update_sql = ''
//   if (idList.length > 0) {
//     update_sql = "UPDATE user_token SET user_id = ?, token = ?"
//   } else {
//     update_sql = "INSERT INTO user_token SET user_id = ?, token = ?"
//   }
//   // 判断结果
//   const update_result = await query(update_sql, [id, token])
//   return {id, token}
// }


// exports.isCurrentUser = async function (uid, token) {
//   const sql = "SELECT user_id FROM user_token WHERE token = ?"
//   const { user_id } = await query(sql, [token])
//   if (user_id == uid) {
//     return true
//   } else {
//     return false
//   }
// }


exports.getDeviceImage = async ({ device_id, page_size, page_num }) => {
  const start = (page_num - 1) * page_size
  const sql = 'SELECT image_url, create_time FROM image_info WHERE device_id = ? ORDER BY modified_time DESC LIMIT ?,?'
  const rows = await query(sql, [device_id, start, page_size])
  return rows
}

exports.getDeviceInfo = async ({device_id}) => {
  const sql = 'SELECT electricity, lock_state, knock_state, poke_state, create_time, 31, 32, 33, 34, 35 FROM device_log WHERE device_id = ? ORDER BY modified_time DESC LIMIT 1'
  const rows = await query(sql, [device_id])
  return rows
}

exports.postCommand = async ({device_id, type, content}) => {
  const insert_part = { device_id, type, content }
  const sql = 'INSERT INTO command_log SET ?'
  const rows = await query(sql, insert_part)
  return rows
}

exports.receiveCommand = async ({insert_id, result}) => {
  const sql = 'UPDATE command_log SET result = ? WHERE id = ?'
  const rows = await query(sql, [result, insert_id])
  return rows
}
