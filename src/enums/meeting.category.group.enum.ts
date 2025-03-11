import { MeetingCategoryEnum, MeetingCategoryEnumType } from '@enums/meeting.category.enum';

export const MeetingCategoryGroupEnum = {
  ANIMAL_NATURE: '동물/자연',
  ACTIVITY: '액티비티',
  SOCIAL_COMMUNITY: '소셜/커뮤니티',
  CULTURE_HOBBY: '문화/취미',
  CAREER_STUDY: '커리어/학습',
} as const;

export type MeetingCategoryGroupEnumType = (typeof MeetingCategoryGroupEnum)[keyof typeof MeetingCategoryGroupEnum];

export function getMeetingCategoryListInGroup(
  meetingCategoryGroup: MeetingCategoryGroupEnumType,
): MeetingCategoryEnumType[] {
  switch (meetingCategoryGroup) {
    case MeetingCategoryGroupEnum.ANIMAL_NATURE:
      return [
        MeetingCategoryEnum.PET,
        MeetingCategoryEnum.PLANT_NATURE,
        MeetingCategoryEnum.VOLUNTEER,
        MeetingCategoryEnum.ENVIRONMENT,
      ];
    case MeetingCategoryGroupEnum.ACTIVITY:
      return [
        MeetingCategoryEnum.GAME,
        MeetingCategoryEnum.SPORTS,
        MeetingCategoryEnum.OUTDOOR_TRAVEL,
        MeetingCategoryEnum.HEALTH,
        MeetingCategoryEnum.CAR_BIKE,
        MeetingCategoryEnum.SPORTS_WATCHING,
      ];
    case MeetingCategoryGroupEnum.SOCIAL_COMMUNITY:
      return [
        MeetingCategoryEnum.SOCIALIZE,
        MeetingCategoryEnum.FOOD_DRINK,
        MeetingCategoryEnum.ALCOHOL,
        MeetingCategoryEnum.RELATIONSHIP,
        MeetingCategoryEnum.FAMILY_PARENTING,
        MeetingCategoryEnum.PSYCHOLOGY_COUNSELING,
      ];
    case MeetingCategoryGroupEnum.CULTURE_HOBBY:
      return [
        MeetingCategoryEnum.BOOK_HUMANITY,
        MeetingCategoryEnum.CRAFT,
        MeetingCategoryEnum.MUSIC,
        MeetingCategoryEnum.INTERIOR,
        MeetingCategoryEnum.BEAUTY,
        MeetingCategoryEnum.CULTURE_PERFORMANCE_FESTIVAL,
        MeetingCategoryEnum.DANCE,
        MeetingCategoryEnum.PICTURE_VIDEO,
        MeetingCategoryEnum.COOK,
      ];
    case MeetingCategoryGroupEnum.CAREER_STUDY:
      return [
        MeetingCategoryEnum.FINANCIAL_TECHNIQUE,
        MeetingCategoryEnum.STUDY,
        MeetingCategoryEnum.CAREER,
        MeetingCategoryEnum.LANGUAGE,
        MeetingCategoryEnum.STARTUP_BUSINESS,
      ];
  }
}
