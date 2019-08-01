// import { PluginRequestOptions, Result } from "yack-plugin-framework";
// import { IDiscourseConfig } from "../config/IDiscourseConfig";
// import { AxiosInstance, AxiosResponse, AxiosProxyConfig, AxiosRequestConfig, AxiosPromise } from "axios";


// function catchErrors<T>(response: AxiosResponse) {
//     const hasErrors = response.status.toString().startsWith('4')
//     let errorType, errors; 
//     if(hasErrors){
//         errors = response.data.errors
//         if("error_type" in response.data){ 
//             errorType = response.data.error_type;
//             if(errorType == "invalid_access"){
//                 return Result.errorWithType<T>(Result.ErrorTypes.InvalidSessionError, errors);
//             }else if(errorType == "rate_limit"){
//                 return Result.errorWithType<T>(Result.ErrorTypes.GenericError, errors);
//             }
//         }else if("action" in response.data){
//             // return Result.errorWithType<T>(Result.ErrorTypes.ValidationError,errors);
//             return Result.validationError<T>(errors);

//         }else{
//             return Result.errorWithType<T>(Result.ErrorTypes.GenericError, errors);
//         }
//     }
// }


// class fetchData<T> {
//     private options: PluginRequestOptions;
//     private config: IDiscourseConfig;
//     private response: AxiosResponse;
//     private hasUser: boolean;
//     private token: string;
//     // private requestUrl: string;
//     private baseUrl: string;
//     private get: AxiosPromise
//     private put: AxiosPromise<T>
//     private post: AxiosPromise<T>
//     private requestConfig: AxiosRequestConfig;
//     private populator: any;


//     constructor(options: PluginRequestOptions, config: IDiscourseConfig, get: AxiosPromise, put: AxiosPromise<T>, post: AxiosPromise<T>, populator?: any) {
//         this.options = options;
//         // this.response;
//         this.hasUser = !!options.session.user
//         this.hasUser ? this.token = options.session.accessToken.token : null;
//         this.config = config;
//         this.baseUrl = config.rootUrl;
//         this.populator = populator;
//         this.hasUser ? this.requestConfig.headers = {[this.config.yackManagedSession ? "Api-Key" : "user-api-key"]: this.token } : this.requestConfig.headers = {};
//         // this.requestUrl = requestUrl;
//         this.get = get
//         this.put = put
//         this.post = post
//     }
//     async getData<T>(requestUrl){
//     this.response = await this.get(requestUrl, this.requestConfig)
//         if(catchErrors<T>(this.response)){
//             return catchErrors<T>(this.response);
//         }else{
//             if(this.populator){
//                 const populated = this.populator(this.response.data);
//                 return Result.success(populated);
//             }else{
//                 return Result.success(null)
//             }
            
//         }
//     }

//     async putData<T>(requestUrl, sendData){
//         this.response = await this.put(requestUrl, sendData, this.requestConfig);
//         if(catchErrors(this.response)){
//             return catchErrors(this.response);
//         }else{
//             if(this.populator){
//                 const populated = this.populator(this.response.data);
//                 return Result.success(populated);
//             }else{
//                 return Result.success(null)
//             }
            
//         }
//     }

//     async postData<T>(requestUrl, sendData){
//         this.response = await this.post(requestUrl, sendData)
//         if(catchErrors(this.response)){
//             return catchErrors(this.response);
//         }else{
//             const populated = this.populator(this.response.data);
//             return Result.success(populated);
//         }
//     }

// }