export const captchaImageMap: Record<string, string> = {};

type captchaMapObj = {
    id : string;
    images : any[];
    challengeType : string
}

export const captchaMap: Record<string, captchaMapObj> = {};