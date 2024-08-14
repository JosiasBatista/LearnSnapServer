export const validateUserReq = (userReq: any): boolean => {
    return (!!userReq.name && !!userReq.email && !!userReq.password);
  }