import { stringUtils, Result } from "yack-plugin-framework";
import { AxiosResponse } from "axios";

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

export function catchErrors<T>(response: AxiosResponse) {
    const hasErrors = response.status.toString().startsWith('4')
    let errorType, errors; 
    if(hasErrors){
        errors = response.data.errors
        if("error_type" in response.data){ 
            errorType = response.data.error_type;
            if(errorType == "invalid_access"){
                return Result.errorWithType<T>(Result.ErrorTypes.InvalidSessionError, errors);
            }else if(errorType == "rate_limit"){
                return Result.errorWithType<T>(Result.ErrorTypes.GenericError, errors);
            }
        }else if("action" in response.data){
            // return Result.errorWithType<T>(Result.ErrorTypes.ValidationError,errors);
            return Result.validationError<T>(errors);

        }else{
            return Result.errorWithType<T>(Result.ErrorTypes.GenericError, errors);
        }
    }
}

// export function populateCatch()

 // session error
    // {"errors":["You are not permitted to view the requested resource."],"error_type":"invalid_access"}

    // "error_type":"rate_limit"
    // expect(json['error_type']).to eq('not_found')
    // error_type === "read_only"
    // expect(body["error_type"]).to eq("invalid_parameters")

    // content error
    // {"action":"create_post","errors":["Title can't be blank","Title is too short (minimum is 1 character)","Title seems unclear, is it a complete sentence?"]}

                    // {"errors":["You’ve performed this action too many times. Please wait a few seconds before trying again."],"error_type":"rate_limit","extras":{"wait_seconds":2}}