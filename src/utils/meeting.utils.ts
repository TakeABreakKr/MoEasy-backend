export class MeetingUtils {
  private static padding: string = 'G';

  public static transformMeetingIdToString(meeting_id: number): string {
    return meeting_id.toString(16).replaceAll('0', MeetingUtils.padding);
  }

  public static transformMeetingIdToInteger(meetingId: string): number {
    return parseInt(meetingId.replaceAll(MeetingUtils.padding, '0'), 16);
  }
}
