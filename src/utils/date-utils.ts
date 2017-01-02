import {Utils} from "./utils";
export class DateUtils {

  constructor() {
  }

  public static getAge(birthDate) {
    var ageDifMs = Date.now() - new Date(birthDate).getTime();
    var ageDate = new Date(ageDifMs);
    var age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age;
  }

  public static sqlfy(d) {
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " 00:00:00+00";
  }

  public static toDateString(date) {
    if(Utils.isEmpty(date)){
      return "";
    }
    let d = new Date(date);
    let str = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear();
    return str;
  }
}
