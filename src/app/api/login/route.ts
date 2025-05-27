import { NextResponse } from "next/server";

function extractAuthCookie(cookieString: string) {
  const match = cookieString.match(/(next-authCookie=[^;]+)/);
  return match ? match[1] : null;
}


async function testCredentialsSignIn(email: string, password: string) {
  const baseUrl = "http://localhost:3000"; // The base URL of your local development server

  try {
    // Step 1: Get the CSRF Token
    const csrfResponse = await fetch(`${baseUrl}/api/auth/csrf`);
    if (!csrfResponse.ok) {
      throw new Error("Failed to fetch CSRF token");
    }
    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken;

    // console.log("CSRF Token:", csrfToken);

    // Step 2: Extract cookies from the CSRF response
    const csrfCookies = csrfResponse.headers.get("set-cookie");
    // console.log("Initial Cookies:", csrfCookies);

    // Step 3: Send a POST request to /api/auth/callback/test with CSRF token and cookies
    // This is the part where the password and email get verfied
    const signInResponse = await fetch(
      `${baseUrl}/api/auth/callback/credentials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: csrfCookies, // Use the cookies from the CSRF response
        },
        body: JSON.stringify({
          csrfToken: csrfToken,
          email: email,
          password: password,
          json: "true",
        }),
      }
    );

    if (!signInResponse.ok) {
      throw new Error("Failed to sign in");
    }

    // // Step 4: Combine cookies from CSRF and sign-in responses
    const signInCookies = signInResponse.headers.get("set-cookie");
    // console.log("!!!!!!!!!!: ", signInCookies);
    // const combinedCookies = `${csrfCookies}; ${signInCookies}`;
    const returnedJWT = extractAuthCookie(signInCookies);
    console.log("Returned JWT:", returnedJWT);
    // console.log("Session Info:", returnedJWT);
    return {returnedJWT, csrfToken: csrfCookies?.split(";")[0]};
  } catch (error) {
    console.error("Error:", error);
    return "Could not log you in!";
  }
}

export async function POST(request: Request, response: Response) {
  const { password, email } = await request.json();
  const { returnedJWT, csrfToken} = await testCredentialsSignIn(email, password);
  // console.log('!!!!: ', result);
  if (typeof returnedJWT !== null) {
    return NextResponse.json({ message: "Login successfully", JWT: returnedJWT, csrfToken }, { status: 200 });
  }
  return NextResponse.json({ message: "Could not log you in!" }, { status: 401});
}
