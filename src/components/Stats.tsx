type Props = {
  title: string
  value: string
  desc: string
}

export const Stats: React.FC<Props> = ({ title, value, desc }) => {
  return (
    <div className="stats w-full">
      <div className="stat">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-desc">{desc}</div>
      </div>
    </div>
  )
}
