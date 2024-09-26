import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler() {
  const skinTones = ['#FFDAB9', '#F5CBA7', '#F0E68C', '#D2B48C', '#CD853F'];
  const randomSkinTone = skinTones[Math.floor(Math.random() * skinTones.length)];

  const bgColors = ['#FF5733', '#33FF57', '#3357FF', '#F39C12', '#8E44AD'];
  const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];

  return new ImageResponse(
    (
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill={randomColor} />
        <circle cx="50" cy="50" r="40" fill={randomSkinTone} stroke="black" strokeWidth="2" />
        <circle cx="35" cy="40" r="4" fill="black" />
        <circle cx="65" cy="40" r="4" fill="black" />
        <path d="M 30 60 Q 50 80 70 60" stroke="black" strokeWidth="3" fill="none" />
      </svg>
    ),
    {
      width: 100,
      height: 100,
    }
  );
}
