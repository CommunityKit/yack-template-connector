export function setDateFormat(seconds: number){
    let date;

    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);

    const ls = [d,h,m]
    if(d > 0){
        date = `${d}d`
        return date;
    }else if(h > 0){
        date = `${h}h`
        return date;
    }else if(m > 0){
        date = `${m}m`
        return date;
    }else{ 
        return `0`
    }

}

export function kFormatter(num: number): string {
    return Math.abs(num) > 999 ? `${Math.sign(num)*(Math.abs(num)/1000)}k` : `${Math.sign(num)*Math.abs(num)}`
}

