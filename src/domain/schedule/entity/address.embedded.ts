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
    address.addressEnglish = addressDto.addressEnglish;
    address.addressType = addressDto.addressType;
    address.noSelected = addressDto.noSelected;
    address.userSelectedType = addressDto.userSelectedType;
    address.roadAddress = addressDto.roadAddress;
    address.roadAddressEnglish = addressDto.roadAddressEnglish;
    address.userLanguageType = addressDto.userLanguageType;
    address.jibunAddress = addressDto.jibunAddress;
    address.jibunAddressEnglish = addressDto.jibunAddressEnglish;
    address.autoRoadAddress = addressDto.autoRoadAddress;
    address.autoRoadAddressEnglish = addressDto.autoRoadAddressEnglish;
    address.autoJibunAddress = addressDto.autoJibunAddress;
    address.autoJibunAddressEnglish = addressDto.autoJibunAddressEnglish;
    address.buildingCode = addressDto.buildingCode;
    address.buildingName = addressDto.buildingName;
    address.apartment = addressDto.apartment;
    address.sido = addressDto.sido;
    address.sidoEnglish = addressDto.sidoEnglish;
    address.sigungu = addressDto.sigungu;
    address.sigunguEnglish = addressDto.sigunguEnglish;
    address.sigunguCode = addressDto.sigunguCode;
    address.roadnameCode = addressDto.roadnameCode;
    address.bcode = addressDto.bcode;
    address.roadname = addressDto.roadname;
    address.roadnameEnglish = addressDto.roadnameEnglish;
    address.bnameEnglish = addressDto.bnameEnglish;
    address.bname1 = addressDto.bname1;
    address.bname1English = addressDto.bname1English;
    address.bname2 = addressDto.bname2;
    address.bname2English = addressDto.bname2English;
    address.hname = addressDto.hname;
    address.query = addressDto.query;

    return address;
  }
}
