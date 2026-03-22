export default function TokenIcon({ size = 24, color = "#FBBF24" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill={color} />
      <circle cx="12" cy="12" r="10" fill="url(#tokenGradient)" />
      <circle cx="12" cy="12" r="7" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
      <path d="M12 8V16M8 12H16" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="10" fill="url(#tokenShine)" opacity="0.3" />
      <defs>
        <linearGradient id="tokenGradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCD34D" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
        <radialGradient id="tokenShine" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(8 8) rotate(45) scale(14)">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
