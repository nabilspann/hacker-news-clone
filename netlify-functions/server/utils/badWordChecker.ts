import { ProfanityOptions, Profanity, profanity } from "@2toad/profanity";

export const censorWords = (text: string) => {
    const options = new ProfanityOptions();
    options.grawlix = '****'
    const profanity = new Profanity(options);
    return profanity.censor(text);
};

export const detectBadWords = (text: string) => {
    return profanity.exists(text);
};
