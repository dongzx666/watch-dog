const {query} = require('../utils/db_util')

exports.isExit = async function ({uid, token}) {
  const sql = "SELECT id FROM user_token WHERE user_id = ? AND token = ?"
  const rows = await query(sql, [uid, token])
  if (!rows.length) {
    return false
  } else {
    return true
  }
}

exports.isPersonalDevice = async function ({uid, token, device_id}) {
  const isExit = await this.isExit({uid, token})
  if (isExit) {
    const sql = 'SELECT id FROM user_device WHERE user_id = ? AND device_id = ?'
    const rows = await query (sql, [uid, device_id])
    if (!rows.length) {
      return false
    } else {
      return true
    }
  }
  return false
}