type Props = {
  title: string
  value: string
  desc: string
  shadow?: boolean
}

export const Stats: React.FC<Props> = ({ title, value, desc, shadow = false }) => {
  return (
    <div className={`stats w-full ${shadow ? 'shadow': ''}`}>
      <div className="stat">
        <div className="stat-title">{title}</div>
        <div className="stat-value !text-lg md:!text-3xl">{value}</div>
        <div className="stat-desc">{desc}</div>
      </div>
    </div>
  )
}
