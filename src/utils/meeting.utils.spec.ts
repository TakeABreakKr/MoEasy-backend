import { MeetingUtils } from '@utils/meeting.utils';

describe('MeetingUtils', () => {
  it('transformMeetingIdToIntegerTest', async () => {
    const testString1 = 'GGGGGG1';
    const result1 = MeetingUtils.transformMeetingIdToInteger(testString1);
    expect(result1).toBe(1);

    const testString2 = 'GA';
    const result2 = MeetingUtils.transformMeetingIdToInteger(testString2);
    expect(result2).toBe(10);

    const testString3 = 'G';
    const result3 = MeetingUtils.transformMeetingIdToInteger(testString3);
    expect(result3).toBe(0);
  });

  it('transformMeetingIdToStringTest', async () => {
    const testNumber = 2304;
    const result = MeetingUtils.transformMeetingIdToString(testNumber);
    expect(result).toBe('9GG');

    const testNumber2 = 10;
    const result2 = MeetingUtils.transformMeetingIdToString(testNumber2);
    expect(result2).toBe('a');

    const testNumber3 = 0;
    const result3 = MeetingUtils.transformMeetingIdToString(testNumber3);
    expect(result3).toBe('G');
  });
});
