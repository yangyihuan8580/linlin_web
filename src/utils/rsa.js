
/* 产引入jsencrypt实现数据RSA加密 */
import JSEncrypt from 'jsencrypt' // 处理长文本数据时报错 jsencrypt.js Message too long for RSA
/* 产引入encryptlong实现数据RSA加密 */
import Encrypt from 'encryptlong'



const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANL378k3RiZHWx5AfJqdH9xRNBmD9wGD\n' +
  '2iRe41HdTNF8RUhNnHit5NpMNtGL0NPTSSpPjjI1kJfVorRvaQerUgkCAwEAAQ=='
// 私钥key
const privateKey = 'MIIBUwIBADANBgkqhkiG9w0BAQEFAASCAT0wggE5AgEAAkEA0vfvyTdGJkdbHkB8\n' +
  'mp0f3FE0GYP3AYPaJF7jUd1M0XxFSE2ceK3k2kw20YvQ09NJKk+OMjWQl9WitG9p\n' +
  'B6tSCQIDAQABAkA2SimBrWC2/wvauBuYqjCFwLvYiRYqZKThUS3MZlebXJiLB+Ue\n' +
  '/gUifAAKIg1avttUZsHBHrop4qfJCwAI0+YRAiEA+W3NK/RaXtnRqmoUUkb59zsZ\n' +
  'UBLpvZgQPfj1MhyHDz0CIQDYhsAhPJ3mgS64NbUZmGWuuNKp5coY2GIj/zYDMJp6\n' +
  'vQIgUueLFXv/eZ1ekgz2Oi67MNCk5jeTF2BurZqNLR3MSmUCIFT3Q6uHMtsB9Eha\n' +
  '4u7hS31tj1UWE+D+ADzp59MGnoftAiBeHT7gDMuqeJHPL4b+kC+gzV4FGTfhR9q3\n' +
  'tTbklZkD2A=='


  export default {
    // /* JSEncrypt加密 */
    // rsaPublicData(data) {
    //   var jsencrypt = new JSEncrypt()
    //   jsencrypt.setPublicKey(publicKey)
    //   // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
    //   var result = jsencrypt.encrypt(data)
    //   return result
    // },
    // /* JSEncrypt解密 */
    // rsaPrivateData(data) {
    //   var jsencrypt = new JSEncrypt()
    //   jsencrypt.setPrivateKey(privateKey)
    //   // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
    //   var result = jsencrypt.encrypt(data)
    //   return result
    // },
    /* 加密 */
    encrypt(data) {
      const PUBLIC_KEY = publicKey
      var encryptor = new Encrypt()
      encryptor.setPublicKey(PUBLIC_KEY)
      // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
      const result = encryptor.encryptLong(data)
      return result
    },
    /* 解密 - PRIVATE_KEY - 验证 */
    decrypt(data) {
      const PRIVATE_KEY = privateKey
      var encryptor = new Encrypt()
      encryptor.setPrivateKey(PRIVATE_KEY)
      // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
      var result = encryptor.decryptLong(data)
      return result
    }
  }