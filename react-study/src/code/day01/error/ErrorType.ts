export const errorMessages = {
  TYPING_ERROR: "입력 값은 최소 1자 이상이어야 합니다.",
  NETWORK_ERROR: "네트워크 오류가 발생했습니다.",
  SERVER_ERROR: "서버 오류가 발생했습니다.",
  NOT_FOUND: "요청한 사용자를 찾을 수 없습니다."
}

export type ErrorType = keyof typeof errorMessages;
