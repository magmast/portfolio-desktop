import abstractPainting from "~/assets/wallpapers/abstract-painting.jpg";
import aiGenerated from "~/assets/wallpapers/ai-generated.jpg";
import colors from "~/assets/wallpapers/colors.png";
import flowers from "~/assets/wallpapers/flowers.png";
import orangeMoon from "~/assets/wallpapers/orange-moon.jpg";
import purpleWaves from "~/assets/wallpapers/purple-waves.jpg";

export const wallpapers = {
  abstractPainting: {
    src: abstractPainting,
    alt: "Abstract Painting",
    description:
      "Image created by [Ravjot Singh](https://www.pexels.com/photo/photo-of-blue-and-orange-abstract-painting-2179483/).",
  },
  orangeMoon: {
    src: orangeMoon,
    alt: "Orange Moon",
    description:
      "Image created by [NASA/Ben Smegelsky](https://www.nasa.gov/image-detail/afs-8-101-908/).",
  },
  purpleWaves: {
    src: purpleWaves,
    alt: "Purple Waves",
    description:
      "Image created by [Philip Oroni](https://unsplash.com/photos/a-close-up-of-a-pink-and-purple-background-C_y8UiVIzP8).",
  },
  flowers: {
    src: flowers,
    alt: "Flowers",
    description:
      "Image created by [Dung Tran](https://pixabay.com/users/kollsd-14736411/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=6170181).",
  },
  aiGenerated: {
    src: aiGenerated,
    alt: "AI Generated",
    description:
      "Image created by [1tamara2](https://pixabay.com/users/1tamara2-15516491/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8879312) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8879312)",
  },
  colors: {
    src: colors,
    alt: "Colors",
    description:
      "Image created by [Speedy McVroom](https://pixabay.com/users/viscious-speed-1744878/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1484014) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1484014).",
  },
};

export const wallpaperKeys = Object.keys(wallpapers) as [
  WallpaperKey,
  ...WallpaperKey[],
];

export type WallpaperKey = keyof typeof wallpapers;
