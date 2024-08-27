const checkApiKey: (apiKey : string) => boolean = (apiKey : string): boolean => {
    if (apiKey !== process.env.API_KEY)
        throw new Error('Unauthorized TOKEN API');
    return true;
}