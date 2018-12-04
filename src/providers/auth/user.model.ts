export interface User {
  uid: string;
  email: string;
}

export interface Email {
  email: string;
  password: string;
}

export interface Profile {
  id: string;
  user_uid: string,
  name: string,
  lastname: string,
  active: boolean,
  jobs: string[],
  email: string
}