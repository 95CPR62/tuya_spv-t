import { FaultCode } from "@/constant";
import Strings from "@/i18n";
import { hexStringToNumber, parseHour12, stringToSecond } from "@ray-js/panel-sdk/lib/utils";

export const myUtils = {
  parseJSON(str) {
    let rst;
    if (str && {}.toString.call(str) === '[object String]') {
      try {
        rst = JSON.parse(str);
      } catch (e) {
        try {
          // eslint-disable-next-line
          rst = eval(`(${str})`);
        } catch (e2) {
          rst = str;
        }
      }
    } else {
      rst = typeof str === 'undefined' ? {} : str;
    }

    return rst;
  },

  hexToDec(hexStr: string) {
    return parseInt(hexStr, 16)
  },
  hexToDecStr(hexStr: string, length: number = 1) {
    return parseInt(hexStr, 16).toString().padStart(length, '0')
  },

  getRhythm(value) {
    return value / 10
  },
  writeRhythm(value) {
    return value * 10
  },

  getFaultCodeLabel(code: number): string {
    switch (code) {
      case FaultCode.OverHeat:
        return Strings.getLang('falutCode10')
      case FaultCode.UnderVoltage:
        return Strings.getLang('falutCode73')
      case FaultCode.NoFlow:
        return Strings.getLang('falutCode74')
      case FaultCode.SVRSDeteced:
        return Strings.getLang('falutCode75')
      case FaultCode.LockRotorDetected:
        return Strings.getLang('falutCode76')
      default:
        return Strings.getLang('falutCode0')
    }
  },

  // displayTime(time24: string, format: number): string {
  //   if (format == 1) {
  //     return time24
  //   }
  //   return parseHour12(stringToSecond(`${time24}:00`))
  // }

  displayTime(time24: string, is24hr: boolean): string {
    if (is24hr) {
      return time24
    }
    return myUtils.toTime12(time24)
  },
  toTime12(time24: string): string {
    const time = time24.split(":")
    var hour = parseInt(time[0])
    var timePeriod = "AM"
    if (hour == 0) {
      hour = 12
    } else if (hour <= 12) {
      if (hour == 12) {
        timePeriod = "PM"
      }
      hour = hour
    } else {
      hour = hour - 12
      timePeriod = "PM"
    }
    const displayHour = hour < 10 ? `0${hour}` : `${hour}`
    return `${displayHour}:${time[1]} ${timePeriod}`
  },
  toTime24(time12: string): string {
    const part = time12.split(" ")
    const timePeriod = part[1]

    const time = time12.split(":")
    var hour = parseInt(time[0])
    if (hour == 12) {
      hour = timePeriod == "AM" ? 0 : 12
    } else if (timePeriod == "PM") {
      hour = hour + 12
    }
    const displayHour = hour < 10 ? `0${hour}` : `${hour}`
    return `${displayHour}:${time[1]}`
  },
  SHA1(msg) {
    function rotate_left(n, s) {
      var t4 = (n << s) | (n >>> (32 - s));
      return t4;
    };

    function lsb_hex(val) {
      var str = "";
      var i;
      var vh;
      var vl;

      for (i = 0; i <= 6; i += 2) {
        vh = (val >>> (i * 4 + 4)) & 0x0f;
        vl = (val >>> (i * 4)) & 0x0f;
        str += vh.toString(16) + vl.toString(16);
      }
      return str;
    };

    function cvt_hex(val) {
      var str = "";
      var i;
      var v;

      for (i = 7; i >= 0; i--) {
        v = (val >>> (i * 4)) & 0x0f;
        str += v.toString(16);
      }
      return str;
    };

    function Utf8Encode(string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }

      }

      return utftext;
    };

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;

    msg = Utf8Encode(msg);

    var msg_len = msg.length;

    var word_array = new Array();
    for (i = 0; i < msg_len - 3; i += 4) {
      j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
      word_array.push(j);
    }

    switch (msg_len % 4) {
      case 0:
        i = 0x080000000;
        break;
      case 1:
        i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
        break;

      case 2:
        i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
        break;

      case 3:
        i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
        break;
    }

    word_array.push(i);

    while ((word_array.length % 16) != 14)
      word_array.push(0);

    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);

    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {

      for (i = 0; i < 16; i++)
        W[i] = word_array[blockstart + i];
      for (i = 16; i <= 79; i++)
        W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

      A = H0;
      B = H1;
      C = H2;
      D = H3;
      E = H4;

      for (i = 0; i <= 19; i++) {
        temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B, 30);
        B = A;
        A = temp;
      }

      for (i = 20; i <= 39; i++) {
        temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B, 30);
        B = A;
        A = temp;
      }

      for (i = 40; i <= 59; i++) {
        temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B, 30);
        B = A;
        A = temp;
      }

      for (i = 60; i <= 79; i++) {
        temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B, 30);
        B = A;
        A = temp;
      }

      H0 = (H0 + A) & 0x0ffffffff;
      H1 = (H1 + B) & 0x0ffffffff;
      H2 = (H2 + C) & 0x0ffffffff;
      H3 = (H3 + D) & 0x0ffffffff;
      H4 = (H4 + E) & 0x0ffffffff;

    }

    temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
    return temp.toLowerCase();
  }
}