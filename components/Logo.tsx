type MarketLogoProps = {
  size?: number
  className?: string
}

export default function MarketLogo({ size = 32, className = '' }: MarketLogoProps) {
  return (
    <img
      src="/IMG_5158.jpeg"
      alt="Mother Side Market Logo"
      style={{
        height: '36px',
        width: 'auto',
        objectFit: 'contain',
        mixBlendMode: 'multiply'
      }}
      className={className}
    />
  )
}
