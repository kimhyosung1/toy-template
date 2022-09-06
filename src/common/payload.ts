import { CommonUserType } from "./common_type";

export interface Payload {
  iss: string;
  sub: string;
  iat: number;
  exp: number;
  aud: string;
  scope: CommonUserType;
  scopes: CommonUserType[];
}
