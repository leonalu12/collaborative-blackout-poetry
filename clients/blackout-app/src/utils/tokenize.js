// clients/blackout-app/src/utils/tokenize.js
export function tokenize(text) {
    // 和 seed.js 里一模一样
    return text.match(/\w+|[^\w\s]|[\s]+/gu) || [];
  }