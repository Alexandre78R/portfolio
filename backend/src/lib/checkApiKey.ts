export const checkApiKey: (apiKey : string) => boolean = (apiKey : string): boolean => {
    console.log("apiKey !== process.env.API_KEY", apiKey !== process.env.API_KEY);
    console.log("apiKey", apiKey);
    console.log("process.env.API_KEY", process.env.API_KEY);
    if (apiKey !== process.env.API_KEY)
        throw new Error('Unauthorized TOKEN API');
    return true;
}