declare module 'jalaali-js' {
  interface JalaaliDate {
    jy: number
    jm: number
    jd: number
  }

  interface GregorianDate {
    gy: number
    gm: number
    gd: number
  }

  interface Jalaali {
    toJalaali(gy: number, gm: number, gd: number): JalaaliDate
    toGregorian(jy: number, jm: number, jd: number): GregorianDate
    jalaaliMonthLength(jy: number, jm: number): number
  }

  const jalaali: Jalaali
  export default jalaali
}

