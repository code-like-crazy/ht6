import { ManagementClient, AuthenticationClient } from "auth0";

const auth0Domain = process.env.AUTH0_DOMAIN!;
const clientId = process.env.AUTH0_CLIENT_ID!;
const clientSecret = process.env.AUTH0_CLIENT_SECRET!;

export const managementClient = new ManagementClient({
  domain: auth0Domain,
  clientId: clientId,
  clientSecret: clientSecret,
});

export const authenticationClient = new AuthenticationClient({
  domain: auth0Domain,
  clientId: clientId,
});
