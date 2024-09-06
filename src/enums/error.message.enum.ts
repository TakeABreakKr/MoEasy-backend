export const ErrorMessageType = {
  NOT_FOUND_MEETING: '해당 모임을 찾을 수 없습니다.',
  NOT_EXIST_REQUESTER: '존재하지 않는 요청자입니다.',
  WRONG_INVITE_URL: '잘못된 초대 요청입니다.',
  MALFORMED_INVITE_URL: '초대 링크가 변조되었습니다.',
  FORBIDDEN_INVITE_REQUEST: '모임 구성원만 초대 요청을 할 수 있습니다.',
} as const;

export type ErrorMessageEnumType = (typeof ErrorMessageType)[keyof typeof ErrorMessageType];
