export const REGEX_PASSWORD = /^(?=.*\d)(?=.*[a-zA-Z\W*])[a-zA-Z\d\W*]{8,}$/;
export const REGEX_UUID =
  /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

// 계좌번호 유효성
export const REGEX_ACCOUNT_NUMBER = /^(\d{1,})(-(\d{1,})){1,}/;
// 핸드폰 번호 유효성
export const REGEX_CALL_NUMBER =
  /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
// 이메일 유효성
export const REGEX_EMAIL =
  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
