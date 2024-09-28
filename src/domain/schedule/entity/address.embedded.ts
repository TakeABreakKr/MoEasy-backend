import { Column } from 'typeorm';
import { AddressDto } from '@domain/schedule/dto/request/schedule.address.dto';

export class Address {
  @Column()
  zonecode: string;

  @Column()
  address: string;

  @Column()
  addressEnglish: string;

  @Column()
  addressType: 'R' | 'J';

  @Column()
  userSelectedType: 'R' | 'J';

  @Column()
  noSelected: 'Y' | 'N';

  @Column()
  userLanguageType: 'K' | 'E';

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

  @Column()
  bnameEnglish: string;

  @Column()
  bname1: string;

  @Column()
  bname1English: string;

  @Column()
  bname2: string;

  @Column()
  bname2English: string;

  @Column()
  hname: string;

  @Column()
  query: string;

  public static create(addressDto: AddressDto): Address {
    const address = new Address();
    address.zonecode = addressDto.zonecode;
    address.address = addressDto.address;

    //마저 해줘 : 넹
    return address;
  }
}
