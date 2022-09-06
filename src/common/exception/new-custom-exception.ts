import { HttpException } from '@nestjs/common'
import { ApiResponseMetadata, ApiResponseSchemaHost, getSchemaPath } from '@nestjs/swagger'

export class BaseException {
  readonly ErrorCode!: number
  readonly ErrorMsg!: string

  constructor (code: number, msg: string) {
    this.ErrorCode = code
    this.ErrorMsg = msg
  }

  public getResponse (dataType?: Function | Function[]) {
    const properties = {
      msg: {
        type: 'string'
      },
      status: {
        type: 'number'
      }
    }

    if (dataType) {
      let schemaPath
      if (dataType instanceof Function) {
        schemaPath = getSchemaPath(dataType)
      } else {
        schemaPath = getSchemaPath(dataType[0])
      }

      Object.assign(properties, {
        data: {
          type: dataType,
          $ref: schemaPath
        }
      })
    }

    return {
      status: this.ErrorCode,
      description: this.ErrorMsg,
      schema: {
        allOf: [
          {
            properties: properties
          }
        ]
      }
    } as ApiResponseMetadata | ApiResponseSchemaHost
  }
}

export class DefaultException {
  // 600~650 은 공통 에러
  static NOT_FOUND_DATA: BaseException = new BaseException(600, '존재하지 않는 데이터 입니다.')
  static REFERENCE_REMAINS: BaseException = new BaseException(601, '참조되고 있는 데이터가 있습니다.')
  static UNAUTHORIZED: BaseException = new BaseException(602, '인증되지 않았습니다.')
  static TOKEN_EXPIRED: BaseException = new BaseException(603, '토큰 기간 만료.')
  static INVALID_TOKEN: BaseException = new BaseException(604, '잘못된 토큰')
}

export const NewCustomException = (error: BaseException, resultObjet?: Object) => {
  const HttpError = new HttpException({
    error: error.ErrorMsg,
    data: resultObjet == null ? error.ErrorCode : resultObjet
  }, error.ErrorCode || 400)

  HttpError.message = error.ErrorMsg
  return HttpError
}
