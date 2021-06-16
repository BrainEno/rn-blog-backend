import { AuthChecker } from "type-graphql";
import { MyContext } from "../types/MyContext";

export const authChecker: AuthChecker<MyContext> = (
  { context: { payload } },
  roles
) => {
  if (roles.length === 0) {
    return payload !== undefined;
  }

  if (!payload) {
    return false;
  }

  if (payload.userRoles?.some((role) => roles.includes(role))) {
    return true;
  }

  return false;
};
