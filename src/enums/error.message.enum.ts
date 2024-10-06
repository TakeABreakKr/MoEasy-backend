export const ErrorMessageType = {
  NOT_FOUND_MEETING: '해당 모임을 찾을 수 없습니다.',
  NOT_FOUND_SCHEDULE: '해당 일정을 찾을 수 없습니다.',
  NOT_EXIST_REQUESTER: '존재하지 않는 요청자입니다.',
  INVALID_TOKEN: '토큰이 전송되지 않았거나 잘못 되었습니다.',
  KEYWORD_LIMIT_EXCEEDED: '키워드 개수는 10개까지 가능합니다.',
  INVALID_KEYWORD_LENGTH: '키워드 글자 수는 10자까지 가능합니다.',
  WRONG_INVITE_URL: '잘못된 초대 요청입니다.',
  MALFORMED_INVITE_URL: '초대 링크가 변조되었습니다.',
  FORBIDDEN_INVITE_REQUEST: '모임 구성원만 초대 요청을 할 수 있습니다.',

  WRONG_NOTIFICATION_OWNER: '알림의 소유자가 다릅니다.',

  SERVER_ERROR: '서버 내 예상하지 못한 에러가 발생했습니다.',
} as const;

export type ErrorMessageEnumType = (typeof ErrorMessageType)[keyof typeof ErrorMessageType];
