// 发送重置密码邮件
export const sendResetPasswordEmail = async (email, resetToken) => {
  // 在实际应用中，这里应该使用邮件服务发送邮件
  // 这里简化处理，只打印日志
  console.log(`发送重置密码邮件到 ${email}，重置令牌：${resetToken}`);
  
  // 模拟异步操作
  return new Promise(resolve => setTimeout(resolve, 100));
};
