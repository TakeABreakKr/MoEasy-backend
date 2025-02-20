import { Column } from 'typeorm';
import { AddressDto } from '@service/activity/dto/request/activity.address.dto';

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

  public toAddressDto(): AddressDto {
    const addressDto = new AddressDto();
    addressDto.zonecode = this.zonecode;
    addressDto.address = this.address;
    addressDto.addressEnglish = this.addressEnglish;
    addressDto.addressType = this.addressType;
    addressDto.noSelected = this.noSelected;
    addressDto.userSelectedType = this.userSelectedType;
    addressDto.roadAddress = this.roadAddress;
    addressDto.roadAddressEnglish = this.roadAddressEnglish;
    addressDto.userLanguageType = this.userLanguageType;
    addressDto.jibunAddress = this.jibunAddress;
    addressDto.jibunAddressEnglish = this.jibunAddressEnglish;
    addressDto.autoRoadAddress = this.autoRoadAddress;
    addressDto.autoRoadAddressEnglish = this.autoJibunAddressEnglish;
    addressDto.autoJibunAddress = this.autoJibunAddressEnglish;
    addressDto.autoJibunAddressEnglish = this.autoJibunAddressEnglish;
    addressDto.buildingCode = this.buildingCode;
    addressDto.apartment = this.apartment;
    addressDto.sido = this.sido;
    addressDto.sigungu = this.sigungu;
    addressDto.sigunguEnglish = this.sigunguEnglish;
    addressDto.sigunguCode = this.sigunguCode;
    addressDto.roadnameCode = this.roadnameCode;
    addressDto.bcode = this.bcode;
    addressDto.roadname = this.roadname;
    addressDto.roadnameEnglish = this.roadnameEnglish;
    addressDto.bnameEnglish = this.bnameEnglish;
    addressDto.bname1 = this.bname1;
    addressDto.bname1English = this.bname1English;
    addressDto.bname2 = this.bname2;
    addressDto.bname2English = this.bname2English;
    addressDto.hname = this.hname;
    addressDto.query = this.query;

    return addressDto;
  }

  static createForTest(): Address {
    const address = new Address();
    address.zonecode = 'test';
    address.address = 'test';
    address.addressEnglish = 'test';
    address.addressType = 'R';
    address.userSelectedType = 'R';
    address.noSelected = 'N';
    address.userLanguageType = 'K';
    address.roadAddress = 'test';
    address.roadAddressEnglish = 'test';
    address.jibunAddress = 'test';
    address.jibunAddressEnglish = 'test';
    address.autoRoadAddress = 'test';
    address.autoRoadAddressEnglish = 'test';
    address.autoJibunAddress = 'test';
    address.autoJibunAddressEnglish = 'test';
    address.buildingCode = 'test';
    address.buildingName = 'test';
    address.apartment = 'Y';
    address.sido = 'test';
    address.sidoEnglish = 'test';
    address.sigungu = 'test';
    address.sigunguEnglish = 'test';
    address.sigunguCode = 'test';
    address.roadnameCode = 'test';
    address.bcode = 'test';
    address.roadname = 'test';
    address.roadnameEnglish = 'test';
    address.bname = 'test';
    address.bnameEnglish = 'test';
    address.bname1 = 'test';
    address.bname1English = 'test';
    address.bname2 = 'test';
    address.bname2English = 'test';
    address.hname = 'test';
    address.query = 'test';

    return address;
  }

  static createTestDto(): AddressDto {
    const dto = new AddressDto();
    dto.zonecode = 'test';
    dto.address = 'test';
    dto.addressType = 'R';
    dto.userSelectedType = 'R';
    dto.noSelected = 'N';
    dto.userLanguageType = 'K';
    dto.roadAddress = 'test';
    dto.sido = 'test';
    dto.sigungu = 'test';
    dto.sigunguEnglish = 'test';
    dto.sigunguCode = 'test';
    dto.roadnameCode = 'test';
    dto.bcode = 'test';
    dto.roadname = 'test';
    dto.roadnameEnglish = 'test';
    dto.bname = 'test';
    dto.bnameEnglish = 'test';
    dto.bname1 = 'test';
    dto.bname1English = 'test';
    dto.bname2 = 'test';
    dto.bname2English = 'test';
    dto.hname = 'test';
    dto.query = 'test';

    return dto;
  }
}
