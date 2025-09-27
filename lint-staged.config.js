export default {
  "*.{ts,tsx,js,jsx,json,md,css,html,sql}": ["prettier --write"],
  "*.{ts,tsx,js,jsx}": [
    "eslint --max-warnings=0 --cache --cache-location .cache/eslint/.eslintcache",
  ],
};
