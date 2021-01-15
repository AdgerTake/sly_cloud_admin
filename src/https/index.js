import axios from 'axios'
import { message } from 'ant-design-vue'
import router from '@/Router'
import config from '../config'
// import qs from 'qs'
const ajax = axios.create({
  baseURL: config.url.requestModuleOne
})

// 服务器登录
ajax.interceptors.request.use(config => {
  config.headers.auto_token = JSON.parse(JSON.stringify(sessionStorage.getItem('auto_token'))) || ''
  return config
})
ajax.interceptors.response.use(res => {
  if (res.data.code == 200) {
    if (res.data.data instanceof Object) {
      return res.data.data
    } else {
      return res.data
    }
  } else if (res.data.code == 403) {
    message.warning('验证失败或已过期，请重新登录！')
    router.push('/')
  } else {
    message.error(res.data.msg)
    return Promise.reject(false)
  }
  console.log(res);
}, error => {
  message.error('系统错误')
  console.log(error.response.status)
  return Promise.reject(false)
})

// 角色列表
export const findAll = (current, size) => {
  return ajax.get(`/admin/role/findAll`, {
    params: {
      current,
      size
    }
  })
}
// 角色新增
export const sysRoleSave = (roleName, status) => {
  return ajax.post(`/admin/role/save`, {
    roleName,
    status
  })
}
// /admin/role/update
export const sysRoleUpdate = (id, roleName, status, permissions) => {
  return ajax.post(`/admin/role/update`, {
    id,
    roleName,
    status,
    permissions
  })
}
// /admin/role/deleteById
export const sysRoleDeleteById = (id) => {
  return ajax.get(`/admin/role/deleteById`, {
    params: {
      id
    }
  })
}
// /admin/user/findAll
export const sysUserFindAll = (current, size) => {
  return ajax.get(`/admin/user/findAll`, {
    params: {
      current,
      size
    }
  })
}
// /admin/user/save
export const sysUserSave = (name, sex, roleName, roleId, username, email, mobile, remark, dept, deptCode) => {
  return ajax.post(`/admin/user/save`, {
    name,
    sex,
    roleName,
    roleId,
    username,
    email,
    mobile,
    remark,
    dept,
    deptCode
  })
}
// /admin/user/update
export const sysUserUpdate = (id, password, name, sex, roleName, roleId, username, status, email, mobile, remark, dept, deptCode) => {
  return ajax.post(`/admin/user/update`, {
    name,
    sex,
    roleName,
    roleId,
    username,
    status,
    email,
    mobile,
    remark,
    id,
    password,
    dept,
    deptCode
  })
}
// /admin/user/deleteById
export const sysUserDeleteById = (id) => {
  return ajax.get(`/admin/user/deleteById`, {
    params: {
      id
    }
  })
}
// /admin/user/findByUserName
export const findByUserName = (username) => {
  return ajax.get(`/admin/user/findByUserName`, {
    params: {
      username
    }
  })
}
// /admin/user/loginUser
export const loginUser = (username, password) => {
  return ajax.get(`/admin/user/loginUser`, {
    params: {
      username,
      password
    }
  })
}
// /bgBanner/findAll
export const bgBannerSearch = (current, size, status) => {
  return ajax.get(`/bgBanner/search`, {
    params: {
      current,
      size,
      status
    }
  })
}
// /bgBanner/save
export const bgBannerAdd = (imgUrl, sort, jumpUrl, stayTime, status, creatorId, creatorName) => {
  return ajax.post(`/bgBanner/add`, {
    sort,
    imgUrl,
    jumpUrl,
    stayTime,
    status,
    creatorId,
    creatorName,
    type: 1
  })
}
// /bgBanner/update
export const bgBannerUpdate = (id, imgUrl, sort, jumpUrl, stayTime, status, creatorId, creatorName) => {
  return ajax.post(`/bgBanner/update`, {
    id,
    sort,
    imgUrl,
    jumpUrl,
    stayTime,
    status,
    creatorId,
    creatorName,
    type: 1
  })
}
// /bgBanner/deleteById
export const bgBannerRemove = (id) => {
  return ajax.get(`/bgBanner/remove`, {
    params: {
      id
    }
  })
}
// /bgGoodsType/findAll
export const bgGoodsTypeSearch= () => {
  return ajax.post(`/bgGoodsType/search`)
}
// /bgGoodsType/add
export const bgGoodsTypeAdd = (name, sort, status, creatorId, creatorName) => {
  return ajax.post(`/bgGoodsType/add`, {
    name,
    sort,
    status,
    creatorId,
    creatorName
  })
}
// /bgGoodsType/update
export const bgGoodsTypeUpdate = (id, name, sort, status, latestOpId,latestOpName) => {
  return ajax.post(`/bgGoodsType/update`, {
    id,
    name,
    sort,
    status,
    latestOpId,
    latestOpName
  })
}
// /bgGoodsAddService/search
export const addServiceSearch= (current, size) => {
  return ajax.post(`/bgGoodsAddService/search`, {
    current,
    size
  })
}
// /bgGoodsAddService/update
export const addServiceUpdate = (id, name, price, status, latestOpId,latestOpName) => {
  return ajax.post(`/bgGoodsAddService/update`, {
    id,
    name,
    price,
    status,
    latestOpId,
    latestOpName
  })
}
// /bgGoods/findAll
export const bgGoodsFindAll= (pageIndex, pageSize, code, name, status, type_code) => {
  return ajax.get(`/bgGoods/findAll`, {
    params: {
      pageIndex,
      pageSize,
      code,
      name,
      status,
      type_code
    }
  })
}
// /bgGoods/add
export const bgGoodsSave= (name, type, typeCode, mainImg, shareImg, bannerImg, detail, status, skuList, addServiceList, createId, createName) => {
  return ajax.post(`/bgGoods/add`, {
    name,
    type,
    typeCode,
    mainImg,
    bannerImg,
    detail,
    shareImg,
    status,
    createName,
    createId,
    skuList,
    addServiceList
  })
}
// /bgGoods/update
export const bgGoodsUpdate= (id, name, type, typeCode, mainImg, shareImg, bannerImg, detail, status, skuList, addServiceList, createId, createName) => {
  return ajax.post(`/bgGoods/update`, {
    detail,
    shareImg,
    status,
    createName,
    createId,
    skuList,
    addServiceList,
    name,
    type,
    typeCode,
    mainImg,
    bannerImg,
    id
  })
}
// /bgGoods/deleteById
export const bgGoodsDeleteById= (id) => {
  return ajax.get(`/bgGoods/remove`, {
    params: {
      id
    }
  })
}
// /bgGoodsAddService/add
export const addServiceAdd= (name, price, status, creatorId, creatorName) => {
  return ajax.post(`/bgGoodsAddService/add`, {
    name,
    price,
    status,
    creatorId,
    creatorName
  })
}
// IOServer/uploadFile
export const uploadFile= (form) => {
  return ajax.post(`/IOServer/uploadFile`, form)
}
// /bgGoods/findGoods
export const findGoodsDetails= (goodsId) => {
  return ajax.get(`/bgGoods/findGoods`, {
    params: {
      goodsId
    }
  })
}
// /bgBatch/add
export const confirmRecived= (orderNo, nameOp, idOp) => {
  return ajax.get(`/bg/order/confirmRecived`, {
    params: {
      orderNo,
      nameOp,
      idOp
    }
  })
}
// /bgBatchInfo/find
// export const bgBatchInfoDetail= (order_code) => {
//   return ajax.get(`/bgBatchInfo/find`, {
//     params: {
//       order_code
//     }
//   })
// }
// /bgBatch/findAll
// export const bgBatchFindAll= () => {
//   return ajax.get(`/bgBatch/findAll`)
// }
// /bgBatch/update
// export const bgBatchUpdate= (id, clothing_img) => {
//   return ajax.get(`/bgBatch/update`, {
//     params: {
//       id,
//       clothing_img
//     }
//   })
// }
// /bgBatch/changeOrderStatus
// export const changeOrderStatus= (order_id) => {
//   return ajax.get(`/bgBatch/changeOrderStatus`, {
//     params: {
//       order_id
//     }
//   })
// }
// /bgBatch/findBachAll
// export const findBachAll= (pageNum, pageSize, batchCode, batchStatus) => {
//   return ajax.get(`/bgBatch/findBachAll`, {
//     params: {
//       pageNum,
//       pageSize,
//       batchCode,
//       batchStatus
//     }
//   })
// }
// /bgBatch/generateBatch
// export const generateBatch= () => {
//   return ajax.get(`/bgBatch/generateBatch`)
// }
// /bgBatch/findBachDetail
// export const findBachDetail= (batchCode) => {
//   return ajax.get(`/bgBatch/findBachDetail`, {
//     params: {
//       batchCode
//     }
//   })
// }
// /bgBatch/checkAcceptByBatchCode
// export const checkAcceptByBatchCode= (batchCode) => {
//   return ajax.get(`/bgBatch/checkAcceptByBatchCode`, {
//     params: {
//       batchCode
//     }
//   })
// }
// /bg/order/sendToUser
export const sendToUser= (orderNo, nameOp, idOp) => {
  return ajax.get(`/bg/order/sendToUser`, {
    params: {
      orderNo,
      nameOp,
      idOp
    }
  })
}
// /bg/order/searchOrders
export const searchOrders= (pageIndex, pageSize, orderNo, status, mobile, sendLogisticsNo, startTime, endTime) => {
  return ajax.get(`/bg/order/searchOrders`, {
    params: {
      orderNo,
      mobile,
      pageIndex,
      pageSize,
      sendLogisticsNo,
      status,
      startTime,
      endTime
    }
  })
}
// /bg/order/orderDetails
export const orderDetails= (orderNo) => {
  return ajax.get(`/bg/order/orderDetails`, {
    params: {
      orderNo
    }
  })
}