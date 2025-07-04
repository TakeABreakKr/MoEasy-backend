export const ErrorMessageType = {
  NOT_FOUND_MEETING: '해당 모임을 찾을 수 없습니다.',
  NOT_FOUND_ACTIVITY: '해당 일정을 찾을 수 없습니다.',
  NOT_FOUND_MEMBER: '해당 멤버를 찾을 수 없습니다.',
  NOT_FOUND_PARTICIPANT: '활동 참여자가 아닙니다.',
  NOT_EXIST_REQUESTER: '존재하지 않는 요청자입니다.',
  JOIN_CONCURRENT_ERROR: '동시에 여러 요청이 처리되어 활동 참여에 실패했습니다.',
  JOIN_OPERATION_ERROR: '활동 참여 중 오류가 발생했습니다.',

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
  DISCORD_PROFILE_IMAGE_UPLOAD_FAILED: '디스코드 프로필 이미지를 업로드하는 데 실패했습니다.',
  TOKEN_ISSUANCE_FAILED: '토큰 발급에 실패했습니다.',

  SERVER_ERROR: '서버 내 예상하지 못한 에러가 발생했습니다.',

  LIKE_CONCURRENT_ERROR: '이미 처리 중인 좋아요 요청이 있습니다.',
  LIKE_OPERATION_ERROR: '좋아요 처리 중 오류가 발생했습니다.',

  MEETING_NOT_EMPTY: '모임에 멤버가 존재하여 삭제할 수 없습니다.',
  PARTICIPANT_LIMIT_EXCEEDED: '참여 인원 제한을 초과했습니다.',
  MAX_MANAGER_COUNT_EXCEEDED: '매니저는 최대 10명까지 등록할 수 있습니다.',
  FILE_NOT_FOUND: '파일을 찾을 수 없습니다.',

  INVALID_URL_FORMAT: '잘못된 URL 형식입니다.',
  INVALID_IMAGE_TYPE: '이미지 파일만 업로드할 수 있습니다.',
  FAILED_TO_FETCH_URL_HEADER: 'URL로부터 파일 정보를 가져올 수 없습니다.',
  FILE_UPLOAD_FAILED: '파일 업로드에 실패했습니다.',
  INVALID_FILE_NAME: '잘못된 파일 이름입니다.',
  ACTIVITY_NOTICE_IMAGE_UPLOAD_FAILED: '활동안내 이미지 등록에 실패했습니다.',
} as const;

export type ErrorMessageEnumType = (typeof ErrorMessageType)[keyof typeof ErrorMessageType];
