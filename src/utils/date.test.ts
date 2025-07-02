/**
 * @file 날짜 포맷팅 유틸리티 함수 단위 테스트
 * @description formatDate 함수의 다양한 입력(문자열, 숫자, Date 객체)과 엣지 케이스에 대한 동작을 검증합니다.
 */
import { describe, it, expect } from "vitest";
import { formatDate } from "./date";

describe("formatDate: 날짜 포맷팅 함수", () => {
  describe("입력 타입별 테스트", () => {
    /**
     * ISO 8601 형식의 문자열이 올바르게 포맷되는지 확인합니다.
     * 실행 환경의 시간대에 따라 결과가 달라질 수 있으므로, 형식 자체를 검증합니다.
     */
    it("ISO 형식의 날짜 문자열을 'YYYY-MM-DD HH:MM' 형식으로 변환해야 합니다.", () => {
      const result = formatDate("2023-12-25T14:30:45.123Z");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });

    /**
     * 숫자 형태의 타임스탬프가 올바르게 포맷되는지 확인합니다.
     */
    it("Unix 타임스탬프(밀리초)를 'YYYY-MM-DD HH:MM' 형식으로 변환해야 합니다.", () => {
      const timestamp = 1703514645000; // 2023-12-25T14:30:45.000Z in UTC
      const result = formatDate(timestamp);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });

    /**
     * JavaScript의 Date 객체가 올바르게 포맷되는지 확인합니다.
     */
    it("Date 객체를 'YYYY-MM-DD HH:MM' 형식으로 변환해야 합니다.", () => {
      const date = new Date("2023-12-25T14:30:45.123Z");
      const result = formatDate(date);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });
  });

  describe("포맷 일관성 테스트", () => {
    /**
     * 날짜나 시간이 한 자리 수일 경우, 앞에 0을 붙여 두 자리로 만드는지 확인합니다.
     */
    it("한 자리 월/일/시간/분을 0으로 채워 두 자리로 표시해야 합니다.", () => {
      const date = new Date("2023-01-05T08:09:00");
      const result = formatDate(date);
      // 'YYYY-MM-DD HH:MM' 형식에 맞게 0이 채워졌는지 확인
      expect(result).toContain("2023-01-05");
      expect(result).toContain("08:09");
    });

    /**
     * 어떤 유효한 입력이든 일관된 'YYYY-MM-DD HH:MM' 형식으로 반환되는지 확인합니다.
     */
    it("항상 'YYYY-MM-DD HH:MM' 형식(길이 16)을 반환해야 합니다.", () => {
      const testInputs = [
        "2023-01-01T00:00:00Z",
        new Date("2023-06-15T12:30:45"),
        1703514645000,
      ];
      testInputs.forEach((input) => {
        const result = formatDate(input);
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
        expect(result).toHaveLength(16);
      });
    });
  });

  describe("엣지 케이스 및 예외 처리", () => {
    /**
     * 유효하지 않은 형식의 입력값을 받았을 때의 동작을 확인합니다.
     * dayjs는 기본적으로 'Invalid Date' 문자열을 반환합니다.
     */
    it("유효하지 않은 날짜 문자열에 대해 적절히 처리해야 합니다.", () => {
      // dayjs는 유효하지 않은 날짜에 대해 "Invalid Date"와 같은 특정 문자열을 반환할 수 있습니다.
      // 여기서는 단순히 문자열을 반환하는지만 확인합니다.
      expect(typeof formatDate("invalid-date")).toBe("string");
      expect(typeof formatDate("")).toBe("string");
    });

    /**
     * Unix epoch (1970년 1월 1일) 이전과 같은 특수한 타임스탬프를 처리하는지 확인합니다.
     */
    it("0 또는 음수 타임스탬프도 정상적으로 처리해야 합니다.", () => {
      expect(formatDate(0)).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
      expect(formatDate(-1000000000)).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });

    /**
     * 4년마다 오는 2월 29일을 정확하게 처리하는지 확인합니다.
     */
    it("윤년(2월 29일)을 정확하게 처리해야 합니다.", () => {
      const leapYearDate = "2024-02-29T12:00:00Z";
      const result = formatDate(leapYearDate);
      expect(result).toContain("2024-02-29");
    });
  });
});
