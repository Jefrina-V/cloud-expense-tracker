import {
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

const env = (import.meta as ImportMeta & {
  env?: Record<string, string | undefined>;
}).env ?? {};

const poolId = env.VITE_COGNITO_USER_POOL_ID;
const clientId = env.VITE_COGNITO_CLIENT_ID;

export const getAccessToken = async (): Promise<string | null> => {
  if (!poolId || !clientId) {
    return null;
  }

  const pool = new CognitoUserPool({
    UserPoolId: poolId,
    ClientId: clientId,
  });

  const user = pool.getCurrentUser();

  if (!user) {
    return null;
  }

  return new Promise((resolve, reject) => {
    user.getSession(
      (err: Error | null, session: CognitoUserSession | null) => {
        if (err) {
          reject(err);
          return;
        }

        if (!session || !session.isValid()) {
          resolve(null);
          return;
        }

        const accessToken = session.getAccessToken().getJwtToken();

        resolve(accessToken);
      }
    );
  });
};