import { sileo } from "sileo";
import {
  AN_UNEXPECTED_ERROR,
  INVALID_MESSAGE,
  NETWORK_ERROR,
} from "./messages";
import {
  FORBIDDEN,
  UNAUTHORIZED_ERROR,
  UNPROCESSABLE_ENTITY,
} from "./statusCodes";
import { TO_LOGIN } from "./urls";
import { handleLogout } from "./AuthLocalService";

export const handleError = async (error: any) => {
  if (error.code === "ERR_CANCELED" || error.name === "CanceledError") {
    return Promise.reject(error);
  }

  if (!error.response) {
    sileo.error({ title: "Network Error", description: NETWORK_ERROR });
    return Promise.reject(error);
  }

  const { status } = error.response;

  if (typeof window !== "undefined" && window.location.pathname !== TO_LOGIN) {
    if (status === UNPROCESSABLE_ENTITY) {
      sileo.error({ title: "Validation Error", description: INVALID_MESSAGE });
    } else if (status === FORBIDDEN || status === UNAUTHORIZED_ERROR) {
      handleLogout();
      window.location.href = TO_LOGIN;
    } else {
      sileo.error({ title: "Error", description: AN_UNEXPECTED_ERROR });
    }
  }

  return Promise.reject(error);
};
