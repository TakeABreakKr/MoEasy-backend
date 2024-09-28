import { Column } from 'typeorm';
import { AddressDto } from '@domain/schedule/dto/request/schedule.address.dto';

export class Address {
  @Column()
  zonecode: string;

  @Column()
  address: string;

  /*
  addressEnglish: string;
  addressType: 'R' | 'J';
  userSelectedType: 'R' | 'J';
  noSelected: 'Y' | 'N';
  userLanguageType: 'K' | 'E';
   */

  @Column()
  roadAddress: string;

  @Column()
  roadAddressEnglish: string;

  @Column()
  jibunAddress: string;

  @Column()
  jibunAddressEnglish: string;

  @Column()
  autoRoadAddress: string;

  @Column()
  autoRoadAddressEnglish: string;

  @Column()
  autoJibunAddress: string;

  @Column()
  autoJibunAddressEnglish: string;

  @Column()
  buildingCode: string;

  @Column()
  buildingName: string;

  @Column()
  apartment: 'Y' | 'N';

  @Column()
  sido: string;

  @Column()
  sidoEnglish: string;

  @Column()
  sigungu: string;

  @Column()
  sigunguEnglish: string;

  @Column()
  sigunguCode: string;

  @Column()
  roadnameCode: string;

  @Column()
  bcode: string;

  @Column()
  roadname: string;

  @Column()
  roadnameEnglish: string;

  @Column()
  bname: string;

  /*
  bnameEnglish: string;
  bname1: string;
  bname1English: string;
  bname2: string;
  bname2English: string;
  hname: string;
  query: string;
  */
}
