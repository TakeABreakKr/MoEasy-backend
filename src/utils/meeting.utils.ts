export class MeetingUtils {
  private static padding: string = 'G';

  public static transformMeetingIdToString(meetingId: number): string {
    return meetingId.toString(16).replaceAll('0', MeetingUtils.padding);
  }

  public static transformMeetingIdToInteger(meetingId: string): number {
    return parseInt(meetingId.replaceAll(MeetingUtils.padding, '0'), 16);
  }
}
