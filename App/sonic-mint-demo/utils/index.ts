import axios from 'axios';

export default {
  formatAddr(value: string) {
    if (!value) return '';
    const index = value.length;
    return value.slice(0, 8) + '...' + value.slice(index - 4, index);
  },

  formatNumber(number: number, decimals: number = 0): string {
    if (!number) return '0';
    const roundedNumber = Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    const [integerPart, decimalPart] = roundedNumber.toFixed(decimals).split('.');
    const integerWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (decimalPart) {
      const trimmedDecimalPart = decimalPart.replace(/0+$/, '');
      return `${integerWithCommas}${trimmedDecimalPart !== '' ? '.' + trimmedDecimalPart : ''}`;
    } else {
      return integerWithCommas;
    }
  },

  formatNumberNoSeparator(number: number, decimals: number = 0) {
    if (!number) return '0';
    const roundedNumber = Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    const [integerPart, decimalPart] = roundedNumber.toFixed(decimals).split('.');
    if (decimalPart) {
      const trimmedDecimalPart = decimalPart.replace(/0+$/, '');
      return `${integerPart}${trimmedDecimalPart !== '' ? '.' + trimmedDecimalPart : ''}`;
    } else {
      return integerPart;
    }
  },

  copyText(value: string) {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = value;
    dummy.select();
    document.execCommand('Copy');
    document.body.removeChild(dummy);
  },

  formatDate(strDate: any, strFormat?: any) {
    if (!strDate) return;
    if (!strFormat) strFormat = 'yyyy/MM/dd HH:mm';
    switch (typeof strDate) {
      case 'string':
        strDate = new Date(strDate.replace(/-/g, '/'));
        break;
      case 'number':
        strDate = new Date(strDate);
        break;
    }
    if (strDate instanceof Date) {
      const dict: any = {
        yyyy: strDate.getFullYear(),
        M: strDate.getMonth() + 1,
        d: strDate.getDate(),
        H: strDate.getHours(),
        m: strDate.getMinutes(),
        s: strDate.getSeconds(),
        MM: ('' + (strDate.getMonth() + 101)).substr(1),
        dd: ('' + (strDate.getDate() + 100)).substr(1),
        HH: ('' + (strDate.getHours() + 100)).substr(1),
        mm: ('' + (strDate.getMinutes() + 100)).substr(1),
        ss: ('' + (strDate.getSeconds() + 100)).substr(1)
      };
      return strFormat.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function (m: any) {
        return dict[m];
      });
    }
  },

  resetRem() {
    const clientWidth = document.body.clientWidth;
    const rem = clientWidth > 750 ? (clientWidth * 100) / 1920 : (clientWidth * 100) / 750;
    console.log('rem', rem);
    document.documentElement.style.fontSize = `${rem}px`;
  },

  randomNum(m, n) {
    var num = Math.floor(Math.random() * (m - n) + n);
    return num;
  },

  async apiPost(url: string, body: any) {
    const result = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' } });
    return result.data;
  }
};
