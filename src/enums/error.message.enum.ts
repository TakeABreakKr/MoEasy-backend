export const ErrorMessageType = {
  NOT_FOUND_MEETING: '해당 모임을 찾을 수 없습니다.',
  NOT_FOUND_ACTIVITY: '해당 일정을 찾을 수 없습니다.',
  NOT_FOUND_MEMBER: '해당 멤버를 찾을 수 없습니다.',
  NOT_FOUND_PARTICIPANT: '일정 참여자가 아닙니다.',
  NOT_EXIST_REQUESTER: '존재하지 않는 요청자입니다.',

  INVALID_TOKEN: '토큰이 전송되지 않았거나 잘못 되었습니다.',
  EXPIRED_TOKEN: '토큰이 만료되었습니다.',
  NO_USER: '사용자를 찾을 수 없습니다.',

  KEYWORD_LIMIT_EXCEEDED: '키워드 개수는 10개까지 가능합니다.',
  INVALID_KEYWORD_LENGTH: '키워드 글자 수는 10자까지 가능합니다.',

  JOIN_REQUEST_DISABLED: '가입 신청을 받지 않는 모임입니다.',
  WRONG_INVITE_URL: '잘못된 초대 요청입니다.',
  MALFORMED_INVITE_URL: '초대 링크가 변조되었습니다.',
  FORBIDDEN_INVITE_REQUEST: '모임 구성원만 초대 요청을 할 수 있습니다.',
  UNAUTHORIZED_ACCESS: '접근 권한이 없습니다.',

  WRONG_NOTIFICATION_OWNER: '알림의 소유자가 다릅니다.',
  INVALID_NOTIFICATION_CHECK_REQUEST: '알림 확인 요청이 잘못 되었습니다.',

  DISCORD_AUTH_CODE_ERROR: '디스코드 인증 코드 오류가 발생했습니다.',
  TOKEN_ISSUANCE_FAILED: '토큰 발급에 실패했습니다.',

  SERVER_ERROR: '서버 내 예상하지 못한 에러가 발생했습니다.',

  LIKE_CONCURRENT_ERROR: '이미 처리 중인 좋아요 요청이 있습니다.',
  LIKE_OPERATION_ERROR: '좋아요 처리 중 오류가 발생했습니다.',

  MEETING_NOT_EMPTY: '모임에 멤버가 존재하여 삭제할 수 없습니다.',
  FILE_NOT_FOUND: '파일을 찾을 수 없습니다.',
} as const;

export type ErrorMessageEnumType = (typeof ErrorMessageType)[keyof typeof ErrorMessageType];
