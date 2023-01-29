// 获取 env
function getEnv() {
  return process.env.NODE_ENV || "development";
}



module.exports = {
  getEnv,
};
