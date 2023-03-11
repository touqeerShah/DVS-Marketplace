
import web3 from "web3"

export function getStringToBytes(stringData: string) {
    // console.log("stringData ... ", stringData)
    let bytesData: string = web3.utils.padRight(web3.utils.fromAscii(stringData), 34)
    // console.log("bytesData ", bytesData)
    return bytesData;
}



export function secondsConverter(seconds: number) {

    var days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    var hrs = Math.floor(seconds / 3600);
    seconds -= hrs * 3600;
    var mnts = Math.floor(seconds / 60);
    seconds -= mnts * 60;
    console.log(days + " days, " + hrs + " Hrs, " + mnts + " Minutes, " + seconds + " Seconds");
    return days + " days, " + hrs + " Hrs, " + mnts + " Minutes, " + seconds + " Seconds"
}