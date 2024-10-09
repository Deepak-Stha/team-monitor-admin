import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loggedOut, tokenReceived } from "../auth/authSlice";
import { BaseApiURL } from "../../contexts/ApiURL"; 
import { Mutex } from "async-mutex";
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: BaseApiURL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        // const token = getState().auth.token;
        const token = localStorage.getItem('token');
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    }
})


const baseQueryWithReauth = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();

    let result = await baseQuery(args, api, extraOptions);
  
    if (result?.error) {
      const { status = 500 } = result.error;
      if (status === "FETCH_ERROR") {
       alert(
          "server is not responding \n please contact to our customer service",
        );
      } else if (status === 406) {
        // api.dispatch(setShowModel());
        api.dispatch(loggedOut());
      } else if (status === 502) {
        if (!mutex.isLocked()) {
          const release = await mutex.acquire();
          try {
            console.log("sending refresh token");
            const refreshResult = await baseQuery(
              "/refreshToken",
              api,
              extraOptions
            );
  
            if (refreshResult?.data) {
              api.dispatch(tokenReceived(refreshResult.data));
              result = await baseQuery(args, api, extraOptions);
            } else {
              alert("session expired!!");
              api.dispatch(loggedOut());
            }
          } finally {
            release();
          }
        } else {
          await mutex.waitForUnlock();
          result = await baseQuery(args, api, extraOptions);
        }
      }
    }
  
    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: (_builder) => ({}),
  });
  