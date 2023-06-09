export const KeyIcon = ({ publicKey }: { publicKey: string }) => {
  return (
    <div className="inline-grid grid-cols-3 gap-0 w-9 h-9">
      {publicKey
        .match(/.{6}/g)
        ?.slice(0, 9)
        .map((c, i) => (
          <div key={i} className="w-3 h-3" style={{ backgroundColor: `#${c}` }} />
        ))}
    </div>
  )
}
