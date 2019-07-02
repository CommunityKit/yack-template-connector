import { Thumbnails, Attachment, AttachmentType, AttachmentProviderType } from "yack-plugin-framework";

export async function populateAttachments(data: any): Promise<Attachment[]> {
    let allAttachments = []

    for(const elem of data){
        const type = determineType(elem.url)
        const providerType = determineProviderType(elem.url)
        let thumbnails;
        if(type == "image"){
            thumbnails = await populateThumbnails(elem.url)
        }
        const attachment: Attachment = {
            type: type,
            providerType: providerType,
            ...elem.title && {title: elem.title},
            // width: data.width,
            // height: data.height,
            url: elem.url,
            ...thumbnails && {thumbnails: thumbnails}
        };
        allAttachments.push(attachment)
    }
    

    return allAttachments;
}

async function populateThumbnails(url): Promise<Thumbnails> {
    let calculatedHeight;
    let calculatedWidth;
    const sizes = await run(url);
    calculatedHeight = sizes.height;
    calculatedWidth = sizes.width;
    const thumbnails: Thumbnails = {
        // small: {
        //     height: thumbs[0].height,
        //     width: thumbs[0].width,
        //     url: thumbs[0].url
        // },
        // ...(thumbs[1] && {
        //     medium: {
        //         height: thumbs[1].height,
        //         width: thumbs[1].width,
        //         url: thumbs[1].url
        //     }
        // }),
       
            high: {
                height: calculatedHeight,
                width: calculatedWidth,
                url: url
            }
        
    };
    return thumbnails;
}

function determineType(str:string){
    let data = str.toLowerCase()
    let type;
    let allTypes = {
        animatedTypes:[".gif", ".apng"],
        imageTypes:[".png", ".jpg", ".jpeg"],
        altImageTypes:[".ai", ".svg", ".eps", ".pdf", ".tiff", ".raw", ".psd"],
        videoTypes:[".mp4", ".mpeg", ".mpeg4", ".avi", ".wmv", ".mpegps", ".flv", ".3gpp", ".webm", ".dnxhr", ".prores", ".cineform", ".hevc"],
        convertVideoFormats:[".mswmm", ".msdvd", ".wlmp", ".camproj", ".imovieproject", ".dvdproj", ".rcproject", ".piv"],
        soundTypes:[".wav", ".flac", ".aiff", ".alac", ".ogg", ".mp2", ".mp3", ".aac", ".amr", ".wma"],
    }

    if(allTypes.imageTypes.some(v => data.indexOf(v) >= 0)){
        type = AttachmentType.Image
    }else if(allTypes.videoTypes.some(v => data.indexOf(v) >= 0)){
        type = AttachmentType.Video
    }else if(allTypes.animatedTypes.some(v => data.indexOf(v) >= 0)){
        type = AttachmentType.Gif
    }else if(allTypes.soundTypes.some(v => data.indexOf(v) >= 0)){
        type = AttachmentType.Audio
    }else{
        type = AttachmentType.Link
    }

    return type;
}


function determineProviderType(data:string){
    let type;
    if(data.includes('www.youtube.com')){
        type = AttachmentProviderType.YouTube;
    }else{
        type = AttachmentProviderType.Unknown
    }
    return type;
}

function getMeta(url): Promise<any> {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

async function run(url) {

  let img = await getMeta(url);

  let w = img.width;
  let h = img.height; 

  return {height: h, width: w}
}

