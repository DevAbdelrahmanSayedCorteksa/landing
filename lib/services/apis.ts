const versionApi = "v1";
const apiModuleUser = "user";

export const API_USER_LOGIN_ENDPOINT = `${versionApi}/${apiModuleUser}/auth/login`;
export const API_USER_REGISTER_ENDPOINT = `${versionApi}/${apiModuleUser}/auth/register`;
export const API_OTP_VERIFY_ENDPOINT = `${versionApi}/${apiModuleUser}/otp/verify`;
export const API_OTP_RESEND_ENDPOINT = `${versionApi}/${apiModuleUser}/otp/resend`;
export const API_FORGOT_PASSWORD_ENDPOINT = `${versionApi}/${apiModuleUser}/auth/forgot-password`;
export const API_RESET_PASSWORD_ENDPOINT = `${versionApi}/${apiModuleUser}/auth/reset-password`;
export const API_USER_STEPER_ENDPOINT = `${versionApi}/${apiModuleUser}/auth/workspaces`;
export const API_PRICING_PLANS_ENDPOINT = `${versionApi}/pricing/plans`;
