import React, { useState, useEffect } from "react"
import Select from "react-select"
import axios from "axios"

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
]

function AddMenuItem() {
  const [price, setPrice] = useState(0)
  const [name, setName] = useState("")
  const [category, setCategory] = useState(options[0].value)

  useEffect(() => {
    ;(async () => {
      const categories = await axios.get("/api/menu/categories")
      console.log(categories)
    })()
  }, [])

  const onChangePrice = (e) => {
    setPrice(e.target.value)
  }
  const onChangeCategory = (newValue) => {
    setCategory(newValue.value)
  }
  const onChangeName = (e) => {
    setName(e.target.value)
  }

  const addMenuItem = async (e) => {
    e.preventDefault()
    try {
      const result = await axios.post(
        "http://localhost:5000/api/admin/menuitem/",
        {
          name,
          price,
          category,
        }
      )
    } catch (e) {}
  }

  return (
    <div className="flex flex-col justify-start h-screen items-center text-white">
      <h1 className="text-2xl p-5">Add Menu Item</h1>
      <form onSubmit={addMenuItem} className="space-y-5 w-full sm:w-[350px]">
        <input
          type="text"
          className="input"
          placeholder="Enter Item name here"
          value={name}
          onChange={onChangeName}
        />
        <input
          type="number"
          className="input"
          placeholder="Enter Price here"
          value={price}
          onChange={onChangePrice}
        />
        <Select
          options={options}
          defaultValue={options[2]}
          onChange={onChangeCategory}
          className="text-black"
          styles={{
            control: (styles) => ({
              ...styles,
              padding: "8px",
            }),
          }}
        />
        {/* Images?? */}
        <div>
          <button type="submit" className="bg-[#44aa04] text-white input">
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddMenuItem
