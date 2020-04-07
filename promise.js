let resolvePromise = (promise2, x, resolve, reject) => {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
  let called;
  // 判断是否为promise
  if (typeof x === 'function' || (typeof x === 'object' && x !== null)) {
    // 有可能是promise，再判断一层
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return;
          called = true;
          // resolve(y); 
          resolvePromise(promise2, y, resolve, reject);  //递归解析，直到y是普通值
        }, e => {
          if (called) return;
          called = true;
          reject(e);
        })
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}
class Promise {
  constructor(executor) {
    this.value = undefined;
    this.reason = undefined;
    this.status = 'pending';
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    let resolve = value => {
      if (typeof x === 'function' || (typeof x === 'object' && x !== null)) {
        if (typeof value.then === 'function') {
          return value.then(resolve, reject);
        }
      }
      if (this.status === 'pending') {
        this.value = value;
        this.status = 'fulfilled';
        this.onResolvedCallbacks.forEach(fn => fn());  // 执行得到的this.value是一样的，类似发布订阅
      }
    }
    let reject = reason => {
      if (this.status === 'pending') {
        this.reason = reason;
        this.status = 'rejected';
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    }
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error)
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    // then返回的是一个新的promise
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);  // return this.value,x才有值
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.status === 'pending') {
        // 这时候this.value和this.reason是undefined,所以要返回一个函数
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    })
    return promise2;
  }
  catch(errCallback) {
    return this.then(null, errCallback);
  }
  finally(final) {
    return this.then(value => {
      return Promise.resolve(final()).then(() => value);
    }, e => {
      return Promise.reject(final()).then(() => { throw e });
    })
  }
  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value);
    })
  }
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    })
  }
  static deferred() {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
    })
    return dfd;
  }
}
module.exports = Promise;
