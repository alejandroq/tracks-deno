export type Ok<T> = {
    type: "value";
    value: T;
  };
  
  export type Err<E> = {
    type: "error";
    error: E & Error;
  };
  
  export type Result<T, E extends Error> = Ok<T> | Err<E>;
  