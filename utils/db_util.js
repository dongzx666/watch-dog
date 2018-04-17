const mysql = require('mysql');
const Promise = require('bluebird');
const config = require('../config/index.js').mysql_config;

const pool = mysql.createPool(config)

exports.query = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}

const executeSequentially = function (promiseFactories) {
  var result = Promise.resolve();
  promiseFactories.forEach(function (promiseFactory) {
    result = result.then(promiseFactory);
  });
  return result;
}

exports.executeTrans = function (sqlparamsEntities) {
  return new Promise (( resolve, reject ) => {
    // 建立连接
    pool.getConnection((err, connection) => {
      if (err) {
        reject( err )
      }
      // sql组合
      let PromiseList = []
      // 开始事务
      connection.beginTransaction(err => {
        if (err) {
          reject(err)
        }
        // 遍历sql并执行
        sqlparamsEntities.forEach(sql_param => {
          let sql = sql_param.sql
          let param = sql_param.param
          // 执行sql包装为Promise对象
          let result = new Promise((resolve, reject) => {
            connection.query(sql, param, function (err, rows) {
              if (err) {
                connection.rollback(function() {
                  reject(err)
                });
              } else {
                resolve(rows)
              }
            })
          })
          PromiseList.push(result)
        })
      })
      const result = executeSequentially(PromiseList)
      connection.commit(function (err) {
        if (err) {
          connection.rollback(function () {
            reject(err)
          });
        }
        connection.release()
        resolve(0)
      })
    })
  })
}

exports.pool = pool

exports.findDataById = function( table,  id ) {
  let  _sql =  "SELECT * FROM ?? WHERE id = ? "
  return query( _sql, [ table, id, start, end ] )
}
