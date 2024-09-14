import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty()
  zonecode: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  addressEnglish: string;

  @ApiProperty()
  addressType: 'R' | 'J';

  @ApiProperty()
  userSelectedType: 'R' | 'J';

  @ApiProperty()
  noSelected: 'Y' | 'N';

  @ApiProperty()
  userLanguageType: 'K' | 'E';

  @ApiProperty()
  roadAddress: string;

  @ApiProperty()
  roadAddressEnglish: string;

  @ApiProperty()
  jibunAddress: string;

  @ApiProperty()
  jibunAddressEnglish: string;

  @ApiProperty()
  autoRoadAddress: string;

  @ApiProperty()
  autoRoadAddressEnglish: string;

  @ApiProperty()
  autoJibunAddress: string;

  @ApiProperty()
  autoJibunAddressEnglish: string;

  @ApiProperty()
  buildingCode: string;

  @ApiProperty()
  buildingName: string;

  @ApiProperty()
  apartment: 'Y' | 'N';

  @ApiProperty()
  sido: string;

  @ApiProperty()
  sidoEnglish: string;

  @ApiProperty()
  sigungu: string;

  @ApiProperty()
  sigunguEnglish: string;

  @ApiProperty()
  sigunguCode: string;

  @ApiProperty()
  roadnameCode: string;

  @ApiProperty()
  bcode: string;

  @ApiProperty()
  roadname: string;

  @ApiProperty()
  roadnameEnglish: string;

  @ApiProperty()
  bname: string;

  @ApiProperty()
  bnameEnglish: string;

  @ApiProperty()
  bname1: string;

  @ApiProperty()
  bname1English: string;

  @ApiProperty()
  bname2: string;

  @ApiProperty()
  bname2English: string;

  @ApiProperty()
  hname: string;

  @ApiProperty()
  query: string;
}
