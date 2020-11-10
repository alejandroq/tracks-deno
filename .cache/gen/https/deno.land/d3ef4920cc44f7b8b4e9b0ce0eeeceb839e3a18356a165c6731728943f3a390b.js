export const CHAR_UPPERCASE_A = 65;
export const CHAR_LOWERCASE_A = 97;
export const CHAR_UPPERCASE_Z = 90;
export const CHAR_LOWERCASE_Z = 122;
export const CHAR_DOT = 46;
export const CHAR_FORWARD_SLASH = 47;
export const CHAR_BACKWARD_SLASH = 92;
export const CHAR_VERTICAL_LINE = 124;
export const CHAR_COLON = 58;
export const CHAR_QUESTION_MARK = 63;
export const CHAR_UNDERSCORE = 95;
export const CHAR_LINE_FEED = 10;
export const CHAR_CARRIAGE_RETURN = 13;
export const CHAR_TAB = 9;
export const CHAR_FORM_FEED = 12;
export const CHAR_EXCLAMATION_MARK = 33;
export const CHAR_HASH = 35;
export const CHAR_SPACE = 32;
export const CHAR_NO_BREAK_SPACE = 160;
export const CHAR_ZERO_WIDTH_NOBREAK_SPACE = 65279;
export const CHAR_LEFT_SQUARE_BRACKET = 91;
export const CHAR_RIGHT_SQUARE_BRACKET = 93;
export const CHAR_LEFT_ANGLE_BRACKET = 60;
export const CHAR_RIGHT_ANGLE_BRACKET = 62;
export const CHAR_LEFT_CURLY_BRACKET = 123;
export const CHAR_RIGHT_CURLY_BRACKET = 125;
export const CHAR_HYPHEN_MINUS = 45;
export const CHAR_PLUS = 43;
export const CHAR_DOUBLE_QUOTE = 34;
export const CHAR_SINGLE_QUOTE = 39;
export const CHAR_PERCENT = 37;
export const CHAR_SEMICOLON = 59;
export const CHAR_CIRCUMFLEX_ACCENT = 94;
export const CHAR_GRAVE_ACCENT = 96;
export const CHAR_AT = 64;
export const CHAR_AMPERSAND = 38;
export const CHAR_EQUAL = 61;
export const CHAR_0 = 48;
export const CHAR_9 = 57;
let NATIVE_OS = "linux";
const navigator = globalThis.navigator;
if (globalThis.Deno != null) {
    NATIVE_OS = Deno.build.os;
}
else if (navigator?.appVersion?.includes?.("Win") ?? false) {
    NATIVE_OS = "windows";
}
export const isWindows = NATIVE_OS == "windows";
export { NATIVE_OS };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NvbnN0YW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIl9jb25zdGFudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0EsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0FBQ25DLE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQUNuQyxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDbkMsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxDQUFDO0FBR3BDLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDM0IsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQUcsRUFBRSxDQUFDO0FBQ3JDLE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztBQUN0QyxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLENBQUM7QUFDdEMsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUM3QixNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxFQUFFLENBQUM7QUFDckMsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQztBQUNsQyxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztBQUN2QyxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxFQUFFLENBQUM7QUFDakMsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsRUFBRSxDQUFDO0FBQ3hDLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDNUIsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUM3QixNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxHQUFHLENBQUM7QUFDdkMsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQUcsS0FBSyxDQUFDO0FBQ25ELE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUFHLEVBQUUsQ0FBQztBQUMzQyxNQUFNLENBQUMsTUFBTSx5QkFBeUIsR0FBRyxFQUFFLENBQUM7QUFDNUMsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsRUFBRSxDQUFDO0FBQzFDLE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUFHLEVBQUUsQ0FBQztBQUMzQyxNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBRyxHQUFHLENBQUM7QUFDM0MsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQUcsR0FBRyxDQUFDO0FBQzVDLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUNwQyxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQzVCLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUNwQyxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFDcEMsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUMvQixNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztBQUN6QyxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFDcEMsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFHN0IsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUN6QixNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBRXpCLElBQUksU0FBUyxHQUF5QixPQUFPLENBQUM7QUFFOUMsTUFBTSxTQUFTLEdBQUksVUFBa0IsQ0FBQyxTQUFTLENBQUM7QUFDaEQsSUFBSSxVQUFVLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRTtJQUMzQixTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7Q0FDM0I7S0FBTSxJQUFJLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxFQUFFO0lBQzVELFNBQVMsR0FBRyxTQUFTLENBQUM7Q0FDdkI7QUFHRCxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcsU0FBUyxJQUFJLFNBQVMsQ0FBQztBQUVoRCxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMifQ==