// import {
//   Inter,
//   Montserrat,
//   Public_Sans,
//   Space_Grotesk,
//   Raleway,
// } from "next/font/google";

// // ===== NIGHT THEME FONTS =====
// const interNight = Inter({
//   subsets: ["latin"],
//   variable: "--font-night-body",
//   display: "swap",
//   weight: ["400", "500", "600", "700", "800", "900"],
// });

// const montserratHeading = Montserrat({
//   subsets: ["latin"],
//   variable: "--font-night-heading",
//   display: "swap",
//   weight: ["600", "700", "800", "900"],
// });

// const ralewayDisplay = Raleway({
//   subsets: ["latin"],
//   variable: "--font-night-display",
//   display: "swap",
//   weight: ["600", "700", "800", "900"],
// });

// // ===== DAY THEME FONTS =====
// const publicSansDay = Public_Sans({
//   subsets: ["latin"],
//   variable: "--font-day-body",
//   display: "swap",
//   weight: ["400", "500", "600", "700", "800", "900"],
// });

// const spaceGroteskHeading = Space_Grotesk({
//   subsets: ["latin"],
//   variable: "--font-day-heading",
//   display: "swap",
//   weight: ["600", "700"],
// });

// const spaceGroteskDisplay = Space_Grotesk({
//   subsets: ["latin"],
//   variable: "--font-day-display",
//   display: "swap",
//   weight: ["600", "700"],
// });

// const fontDefinitions = [
//   // Night
//   interNight,
//   montserratHeading,
//   ralewayDisplay,
//   // Day
//   publicSansDay,
//   spaceGroteskHeading,
//   spaceGroteskDisplay,
// ];

// export const fontConfig = {
//   fonts: {
//     // Night
//     interNight,
//     montserratHeading,
//     ralewayDisplay,
//     // Day
//     publicSansDay,
//     spaceGroteskHeading,
//     spaceGroteskDisplay,
//   },

//   // Auto-generated variables string
//   variables: fontDefinitions.map((font) => font.variable).join(" "),

//   // Base font class
//   className: "font-sans antialiased",

//   // Combined for easy usage in layout
//   get fullClassName() {
//     return `${this.variables} ${this.className}`;
//   },
// };

// export type FontTheme = "night" | "day";
