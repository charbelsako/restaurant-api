import React, { useState } from "react"
import Select from "react-select"

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
]

function AddMenuItem() {
  const [price, setPrice] = useState(0)
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")

  const onChangePrice = (e) => {
    setPrice(e.target.value)
  }
  const onChangeCategory = (newValue) => {
    setCategory(newValue.value)
  }
  const onChangeName = (e) => {
    setName(e.target.value)
  }

  const addMenuItem = () => {}

  console.log(category)

  return (
    <div className="flex flex-col justify-start h-screen items-center text-white">
      <h1 className="text-2xl p-5">Add Menu Item</h1>
      <form onSubmit={addMenuItem} className="space-y-5">
        <div>
          <input
            type="text"
            className="input"
            placeholder="Enter Item name here"
            value={name}
            onChange={onChangeName}
          />
        </div>
        <div>
          <input
            type="number"
            className="input"
            placeholder="Enter Price here"
            value={price}
            onChange={onChangePrice}
          />
        </div>
        <Select
          options={options}
          defaultValue={options[2]}
          onChange={onChangeCategory}
          styles={{
            control: (styles) => ({ ...styles, padding: "8px" }),
          }}
        />
        <div>
          <button
            type="submit"
            className="bg-[#44aa04] p-3 rounded text-white w-full"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddMenuItem
