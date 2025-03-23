import { EnumUtil } from '@utils/enum.util';
import { ErrorMessageType } from '@enums/error.message.enum';

export const RegionEnum = {
  // 서울
  GANGSEO: '강서구',
  YANGCHEON: '양천구',
  YEONGDEUNGPO: '영등포구',
  YONGSAN: '용산구',
  EUNPYEONG: '은평구',
  JONGNO: '종로구',
  JOONG: '중구',
  JOONGRANG: '중랑구',
  DONGDAEMUN: '동대문구',
  DONGJAK: '동작구',
  MAPO: '마포구',
  SEOCHO: '서초구',
  SEODAEMUN: '서대문구',
  SEONGDONG: '성동구',
  SEONGBUK: '성북구',
  SONGPA: '송파구',
  GANGNAM: '강남구',
  GANGDONG: '강동구',
  GANGBUK: '강북구',
  GWANAK: '관악구',
  GWANGJIN: '광진구',
  GURO: '구로구',
  GEUMCHEON: '금천구',
  NOWON: '노원구',
  DOBONG: '도봉구',
  // 경기도
  SUWON: '수원시',
  SEONGNAM: '성남시',
  GOYANG: '고양시',
  YONGIN: '용인시',
  BUCHEON: '부천시',
  ANSAN: '안산시',
  ANYANG: '안양시',
  NAMYANGJU: '남양주시',
  HWASEONG: '화성시',
  PYEONGTAEK: '평택시',
  UIJEONGBU: '의정부시',
  SIHEUNG: '시흥시',
  PAJU: '파주시',
  GIMPO: '김포시',
  GWANGMYEONG: '광명시',
  GWANGJU: '광주시',
  GURI: '구리시',
  OSAN: '오산시',
  GUNPO: '군포시',
  UIWANG: '의왕시',
  HANAM: '하남시',
  YANGJU: '양주시',
  DONGDUCHEON: '동두천시',
  ANSEONG: '안성시',
  YEOJU: '여주시',
  ICHEON: '이천시',
  POCHEON: '포천시',
  GAPYEONG: '가평군',
  YANGPYEONG: '양평군',
  YEONCHEON: '연천군',
  // etc
  BS: '부산',
  KN: '경남',
  IC: '인천',
  KP: '경북',
  DG: '대구',
  CN: '충남',
  JN: '전남',
  JP: '전북',
  CP: '충북',
  KW: '강원',
  DJ: '대전',
  GJ: '광주',
  US: '울산',
  JJ: '제주',
  SJ: '세종',
} as const;

export type RegionEnumType = (typeof RegionEnum)[keyof typeof RegionEnum];

export function getRegionEnum(sido: string, sigungu: string): RegionEnumType {
  const enumValue = Object.keys(RegionEnum)
    .filter((key) => {
      if (sido.includes('서울') || sido.includes('경기')) {
        return sigungu.includes(RegionEnum[key]);
      }
      return sido.includes(RegionEnum[key]);
    })
    .map((key) => RegionEnum[key]);

  if (enumValue.length === 0) {
    throw new Error(`매칭되는 Region Enum을 찾지 못했습니다. sido: ${sido}, sigungu: ${sigungu}`);
  }
  return enumValue[0];
}

export function findEnumKeyFromValue(name: RegionEnumType): keyof typeof RegionEnum {
  const enumKey = EnumUtil.findEnumKeyFromValue<typeof RegionEnum>(RegionEnum, name);
  if (!enumKey) {
    throw new Error(ErrorMessageType.REGION_NAME_INVALID);
  }

  return enumKey;
}
