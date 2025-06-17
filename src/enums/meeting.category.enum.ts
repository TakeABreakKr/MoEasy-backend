import { EnumUtil } from '@utils/enum.util';

export const MeetingCategoryEnum = {
  PET: '반려동물',
  PLANT_NATURE: '식물/자연',
  VOLUNTEER: '봉사활동',
  ENVIRONMENT: '환경',

  GAME: '게임/오락',
  SPORTS: '운동/스포츠',
  OUTDOOR_TRAVEL: '아웃도어/여행',
  HEALTH: '건강',
  CAR_BIKE: '자동차/오토바이',
  SPORTS_WATCHING: '스포츠 관람',

  SOCIALIZE: '사교/친목',
  FOOD_DRINK: '음식/음료',
  ALCOHOL: '술',
  RELATIONSHIP: '연애/이성관계',
  FAMILY_PARENTING: '가족/육아',
  PSYCHOLOGY_COUNSELING: '심리/상담',

  BOOK_HUMANITY: '독서/인문학',
  CRAFT: '공예/만들기',
  MUSIC: '악기/음악',
  INTERIOR: '인테리어/가구',
  BEAUTY: '미용',
  CULTURE_PERFORMANCE_FESTIVAL: '문화/공연/축제',
  DANCE: '댄스/무용',
  PICTURE_VIDEO: '사진/영상',
  COOK: '요리',

  FINANCIAL_TECHNIQUE: '재테크',
  STUDY: '자기계발/공부',
  CAREER: '커리어/직장',
  LANGUAGE: '외국/언어',
  STARTUP_BUSINESS: '창업/사업',
} as const;

export type MeetingCategoryEnumType = (typeof MeetingCategoryEnum)[keyof typeof MeetingCategoryEnum];

export function findEnumKeyFromValue(value: MeetingCategoryEnumType): keyof typeof MeetingCategoryEnum {
  return EnumUtil.findEnumKeyFromValue(MeetingCategoryEnum, value);
}
