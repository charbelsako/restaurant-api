import React, { useState } from 'react'
import axios from 'axios'

function AddIngredients() {
  const [name, setName] = useState('')

  const onChangeName = (e) => {
    setName(e.target.value)
  }

  const addIngredient = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/admin/ingredient/', {
        name,
      })
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-10 text-white">
      <h1 className="text-4xl">Add Ingredient</h1>
      <form onSubmit={addIngredient} className="space-y-10 w-full sm:w-[350px]">
        <input
          type="text"
          className="input"
          placeholder="Enter Ingredient name here"
          value={name}
          onChange={onChangeName}
        />
        <div>
          <button type="submit" className="bg-[#44aa04] text-white input">
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddIngredients
