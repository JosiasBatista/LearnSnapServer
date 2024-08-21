export const validateUserAuthReq = (userReq: any, isLogin: boolean): boolean => {
  if (isLogin) {
    return !!userReq.email && !!userReq.password;
  } else {
    const validPass = userReq.password === userReq.passwordConfirm && !!userReq.password;

    return (!!userReq.name && !!userReq.email && validPass && userReq.type);
  }
}