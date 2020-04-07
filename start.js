let Promise = require('./promise');
let fs = require('fs');
let path = require('path');

// let p = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     reject(100);
//   }, 1000);
// });

// p.then(data => {
//   console.log(data,'success')
// }, err => {
//   console.log(err, 'fail')
// })

// p.then(data => {
//   console.log(data, 'success')
// }, err => {
//   console.log(err, 'fail')
// })

// p.then(data => {
//   console.log(data, 'success')
// }, err => {
//   console.log(err, 'fail')
// })
// function readFile(url) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(path.resolve(__dirname, url), 'utf8', function (err, data) {
//       if (err) reject(err);
//       resolve(data)
//     })
//   })
// }

// readFile(path.resolve(__dirname, './name.txt')).then(data => {
//   return data;
// }, err => {
//   console.log(err)
// }).then(data => {
//   readFile(path.resolve(__dirname, data), 'utf8').then(data => {
//     console.log(data)
//   })
// })

let p2 = new Promise((resolve, reject) => {
    reject(1000)
})
p2.finally(() => {
  console.log(111)
})
p2.then((data => {
  console.log(data)
}))
p2.catch(err => {
  console.log(err)
})

// 全局安装node包只能在命令行中使用
// 在本地安装可以在代码和命令行中使用
Promise.reject(2000).then(data=>{
  console.log(data)
}).catch(err => {
  console.log(err)
})
