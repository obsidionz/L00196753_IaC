export const handler = async (event) => {
  const fullToken = (event.authorizationToken || "").trim(); // trim whitepace from header
  const methodArn = event.methodArn; // ARN for API method 
  const EXPECTED_SECRET = "YOUR_SECRET_TOKEN"; // Bearer Token Secret
  // console.log("Received token:", fullToken);
  // console.log("Expected token:", EXPECTED_SECRET);

  let token = ""; // initialize token as non const
  if (fullToken.startsWith("Bearer ") || fullToken.startsWith("bearer ")) {
      token = fullToken.substring(7); // "Bearer " is 7 characters long with space truncate from char 7
  } else {
      token = fullToken; // Use the full token if no Bearer prefix is found
  }
  // console.log("Tokens match:", token === EXPECTED_SECRET);
  try {
    // token validation logic
    if (token === EXPECTED_SECRET) {
      return { // send back allow invoke
        principalId: "user-id",
        policyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: "execute-api:Invoke",
              Effect: "Allow",
              Resource: methodArn,
            },
          ],
        },
        context: {
          userId: "authenticated-user",
        },
      };
    } else {
      throw new Error("Unauthorized"); // failed token check send Unauthorized
    }
  } catch (error) {
//  console.error("Authorization failed:", error);
    return {  // Auth failed on token deny invoke
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: methodArn,
          },
        ],
      },
    };
  }
};
