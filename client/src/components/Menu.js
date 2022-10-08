import React from "react"

export default function Menu({ items }) {
  return (
    <div>
      {items.map((item) => (
        <div key={item._id}>
          <p className="text-md">{item.name}</p>
        </div>
      ))}
    </div>
  )
}
