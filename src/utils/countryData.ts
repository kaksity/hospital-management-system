export interface CountryCode {
    name: string;
    code: string;
    flag: string;
    dialCode: string;
}

export const countryCodes: CountryCode[] = [
    { name: "Nigeria", code: "NG", flag: "🇳🇬", dialCode: "+234" },
    { name: "United States", code: "US", flag: "🇺🇸", dialCode: "+1" },
    { name: "United Kingdom", code: "GB", flag: "🇬🇧", dialCode: "+44" },
    { name: "Canada", code: "CA", flag: "🇨🇦", dialCode: "+1" },
    { name: "Australia", code: "AU", flag: "🇦🇺", dialCode: "+61" },
    { name: "Ghana", code: "GH", flag: "🇬🇭", dialCode: "+233" },
    { name: "South Africa", code: "ZA", flag: "🇿🇦", dialCode: "+27" },
    { name: "Kenya", code: "KE", flag: "🇰🇪", dialCode: "+254" },
    { name: "United Arab Emirates", code: "AE", flag: "🇦🇪", dialCode: "+971" },
    { name: "China", code: "CN", flag: "🇨🇳", dialCode: "+86" },
    { name: "India", code: "IN", flag: "🇮🇳", dialCode: "+91" },
    { name: "Brazil", code: "BR", flag: "🇧🇷", dialCode: "+55" },
    { name: "France", code: "FR", flag: "🇫🇷", dialCode: "+33" },
    { name: "Germany", code: "DE", flag: "🇩🇪", dialCode: "+49" },
];
