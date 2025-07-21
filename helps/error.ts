 export const HandleError = (error: unknown, message: string) => {
  console.log(error, message)
  throw error

}