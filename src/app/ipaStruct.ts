export interface ipaStruct {
    word: string;
    ipa: string;
    audio: string;
};

export interface parsedValue {
	index: number;
	length: number;
};

export interface graphingData {
    time: number;
    errors: number;
}