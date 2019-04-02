const {query, executeTrans, pool} = require('../utils/db_util')

exports.getDeviceLog = async ({device_id, pageSize=5, pageNum=1}) => {
  const previous = (pageNum - 1) * pageSize
  const sql = 'SELECT content, create_time FROM device_log WHERE device_id = ? LIMIT ?, ?'
  const rows = await query(sql, [device_id, previous, pageSize])
  rows.forEach(item => {
    item.create_time = new Date(item.create_time).getTime()
  })
  return rows
}

exports.insertDeviceInfo = async (device_id, device_info, type = 0) => {
  const insert_part = Object.assign({device_id, type}, device_info)
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
  const rows = await query(sql, [device_id])
  return rows[0].user_id
}

exports.getAlias = async (user_id) => {
  const sql = 'SELECT alias FROM user_info WHERE id = ?'
  const rows = await query(sql, [user_id])
  return rows[0].alias
}
