// // import { axios } from '@/utils/request'
// const data = axios({
//   url: 'http://accounts.jpushoa.com/user/' + 'xiaxx',
//   method: 'get',
//   headers: {
//     'Content-Type': 'application/json;charset=UTF-8'
//   }
// })

// console.log(data)

// function multiply(num1, num2) {
//   var total = num1 + num2;
//   alert(total);
// }

// multiply(10, 2);

// let vm = new WeakMap();
// let container = {
//   key: {}
// }

// vm.set(container.key, "val")
// container.key = null
// console.log(vm)

// let set = new Set([1,2,3])
// console.log(set)

// let s1 = Symbol("key")
// let s2 = Symbol("key")
// console.log(s1===s2)

// let obj = {
//   [Symbol("key")]: '值',
//   name: '张三'
// }

// let res = Object.getOwnPropertySymbols(obj);
// console.log(res)
// console.log(obj[res[0]])


// let cate = {
//   person: Symbol("key"),
//   dog: Symbol("key")
// }

// function getCate(type) {
//   if (type===cate.person) {
//     console.log('人')
//   } else if (type === cate.dog) {
//     console.log('狗')
//   }
// }

// getCate(cate.person)

// getCate(cate.dog)

// let f = function (v) {
//   return v;
// }

// let g = v => v;

// console.log(f(10))

// console.log(g(10))

// let f = v => {
//   name: '张三'
// }

// let g = ()=> ({name: '张三'})

// console.log(g())




