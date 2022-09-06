import { BaseException, DefaultException } from "src/common/exception/new-custom-exception";

export class UserException extends DefaultException {
  static USER_NOT_FOUND : BaseException = new BaseException(651, 'USER_NOT_FOUND')
  static NOT_ALLOWED_USER : BaseException = new BaseException(651, 'NOT_ALLOWED_USER')
}
