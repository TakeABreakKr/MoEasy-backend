import { MeetingUtils } from '@utils/meeting.utils';

describe('MeetingUtils', () => {
  it('transformMeetingIdToInteger', async () => {
    const testString: string = '1';
    const result: number = MeetingUtils.transformMeetingIdToInteger(testString);
    expect(result).toBe(1);
  });
});
