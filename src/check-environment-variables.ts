require("dotenv").config();
import assert from "assert";
export const IS_PRODUCTION = !(
  process.env.NODE_ENV && process.env.NODE_ENV.match("development")
);

// This will cause the app to crash on start if any env vars are missing / undefined
export const checkEnvironmentVariables = () => {
  if (IS_PRODUCTION) {
    assert(
      process.env.PRODUCTION_COOKIE_DOMAIN,
      "missing env: PRODUCTION_COOKIE_DOMAIN"
    );
    assert(process.env.PRODUCTION_COOKIE1, "missing env: PRODUCTION_COOKIE1");
    assert(process.env.PRODUCTION_COOKIE2, "missing env: PRODUCTION_COOKIE2");
    assert(
      process.env.PRODUCTION_API_TOKEN,
      "missing env: PRODUCTION_API_TOKEN"
    );
    assert(
      process.env.PRODUCTION_MONGO_URI,
      "missing env: PRODUCTION_MONGO_URI"
    );
  } else {
    assert(process.env.DEV_COOKIE_DOMAIN, "missing env: DEV_COOKIE_DOMAIN");
    assert(process.env.DEV_COOKIE1, "missing env: DEV_COOKIE1");
    assert(process.env.DEV_COOKIE2, "missing env: DEV_COOKIE2");
    assert(process.env.DEV_MONGO_URI, "missing env: DEV_MONGO_URI");
  }
};
