/**
 * 解析响应结果
 */
export const parseErrorCode = res => {
  console.log("解析响应是否正确:" + res);

  let success = false;

  if (res.code != 200 && res.code != 0) {
    success = false;
  } else {
    if (!res.success) {
      success = false;
    } else {
      success = true;
    }
  }
  console.log("解析结果:" + success);

  return success;
};

/**
 * 获取错误信息
 */
export const getErrorMsg = res => {
  console.log("解析响应错误码:" + res);
  let msg = "";
  if (parseErrorCode(res)) {
    msg = "";
  } else {
    if (res.msg) {
      msg = res.msg;
    } else {
      msg = "http结果未知错误";
    }
  }
  return msg;
};
