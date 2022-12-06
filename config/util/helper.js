/**
 * @author xun
 * 获取env
 */
function getEnv() {
  return process.env.NODE_ENV || "development";
}

module.exports = {
  getEnv,
};
