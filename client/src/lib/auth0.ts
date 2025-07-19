import { getCustomSession } from "./custom-session";

// Use our custom session system that integrates with Auth0
export const auth0 = {
  async getSession() {
    return await getCustomSession();
  },
};
