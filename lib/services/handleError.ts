import { toast } from "sonner";
import {
  AN_UNEXPECTED_ERROR,
  INVALID_MESSAGE,
  NETWORK_ERROR,
} from "./messages";
import { FORBIDDEN, UNPROCESSABLE_ENTITY } from "./statusCodes";
import { TO_LOGIN } from "./urls";
import { handleLogout } from "./AuthLocalService";

export const handleError = async (error: any) => {
  if (error.code === "ERR_CANCELED" || error.name === "CanceledError") {
    return Promise.reject(error);
  }

  if (!error.response) {
    toast.error(NETWORK_ERROR);
    return Promise.reject(error);
  }

  const { status } = error.response;

  if (typeof window !== "undefined" && window.location.pathname !== TO_LOGIN) {
    if (status === UNPROCESSABLE_ENTITY) {
      toast.error(INVALID_MESSAGE);
    } else if (status === FORBIDDEN) {
      handleLogout();
      window.location.href = TO_LOGIN;
    } else {
      toast.error(AN_UNEXPECTED_ERROR);
    }
  }

  return Promise.reject(error);
};
