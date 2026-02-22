const versionApi = "v1";
const apiModuleUser = "user";

export const API_USER_LOGIN_ENDPOINT = `${versionApi}/${apiModuleUser}/auth/login`;
export const API_USER_REGISTER_ENDPOINT = `${versionApi}/${apiModuleUser}/auth/register`;
export const API_OTP_VERIFY_ENDPOINT = `${versionApi}/${apiModuleUser}/otp/verify`;
export const API_OTP_RESEND_ENDPOINT = `${versionApi}/${apiModuleUser}/otp/resend`;
export const API_FORGOT_PASSWORD_ENDPOINT = `${versionApi}/${apiModuleUser}/auth/forgot-password`;
export const API_RESET_PASSWORD_ENDPOINT = `${versionApi}/${apiModuleUser}/auth/reset-password`;
export const API_USER_STEPER_ENDPOINT = `${versionApi}/${apiModuleUser}/auth/workspaces`;
export const API_CHECK_SUBDOMAIN_ENDPOINT = `${versionApi}/${apiModuleUser}/auth/check-subdomain`;
export const API_PRICING_PLANS_ENDPOINT = `${versionApi}/pricing/plans`;
export const API_PRICING_ENDPOINT = `${versionApi}/${apiModuleUser}/pricing`;
export const API_OBJECT_TEMPLATES_ENDPOINT = `${versionApi}/${apiModuleUser}/object-templates`;
export const API_OBJECT_TEMPLATE_BY_SLUG_ENDPOINT = (slug: string) =>
  `${versionApi}/${apiModuleUser}/object-templates/${slug}`;
export const API_TEMPLATE_GENERATE_ENDPOINT = `${versionApi}/${apiModuleUser}/auth/template/generate`;
export const API_TEMPLATE_SAVE_ENDPOINT = `${versionApi}/${apiModuleUser}/auth/template/save`;
export const API_REFRESH_TOKEN_ENDPOINT = `${versionApi}/${apiModuleUser}/auth/refresh`;
