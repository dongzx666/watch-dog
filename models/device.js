const {query, executeTrans, pool} = require('../utils/db_util')

// exports.isRegistered = async device_id => {
//   const sql = "SELECT status FROM device_info WHERE id = ?"
//   const rows = await query(sql, [device_id])
//   if (rows.length > 0) {
//     if (rows[0].status == 1) {
//       return true
//     } else {
//       return false
//     }
//   }
// }

// exports.isExitDevice = async device_token => {
//   const sql = "SELECT id FROM device_info WHERE device_token = ?"
//   const rows = await query(sql, [device_token])
//   if (!rows.length) {
//     return rows[0].id
//   } else {
//     return false
//   }
// }

// exports.register = async (user_id, device_id) => {
//   const sqlArr = [{
//     sql: "UPDATE device_info SET status = 1 WHERE id = ?",
//     param: [device_id]
//   }, {
//     sql: "INSERT INTO user_device SET user_id = ?, device_id = ?",
//     param: [user_id, device_id]
//   }]
//   const data = await executeTrans(sqlArr)
//   return data
// }

exports.getDeviceLog = async ({device_id, pageSize=5, pageNum=1}) => {
  const previous = (pageNum - 1) * pageSize
  const sql = 'SELECT content, create_time FROM device_log WHERE device_id = ? LIMIT ?, ?'
  const rows = await query(sql, [device_id, previous, pageSize])
  rows.forEach(item => {
    item.create_time = new Date(item.create_time).getTime()
  })
  return rows
}

exports.insertDeviceInfo = async (device_id, device_info) => {
  const insert_part = Object.assign({device_id}, device_info)
  const sql = 'INSERT INTO device_log SET ?'
  const rows = await query(sql, insert_part)
  return rows
}

exports.insertDeviceImage = async (device_id, image_url) => {
  const insert_part = { device_id, image_url }
  const sql = 'INSERT INTO image_info SET ?'
  const rows = await query(sql, insert_part)
  return rows
}

exports.getUserByDevice = async (device_id) => {
  const sql = 'SELECT user_id FROM user_device WHERE device_id = ?'
  const rows = await query(sql, device_id)
  return rows[0].user_id
}

exports.getAlias = async (user_id) => {
  const sql = 'SELECT alias FROM user_info WHERE id = ?'
  const rows = await query(sql, user_id)
  return rows[0].alias
}
