import { Models } from "appwrite";

export interface UserRequest extends Models.Row {
  email: string;
  password: string;
}