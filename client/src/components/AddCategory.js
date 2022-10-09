import React, { useState } from 'react'
import axios from 'axios'

function AddCategory() {
  const [name, setName] = useState('')

  const onChangeName = (e) => {
    setName(e.target.value)
  }

  const addCategory = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/admin/category/', {
        name,
      })
    } catch (e) {}
  }

  return (
    <div className="h-screen flex flex-col justify-start items-center space-y-5 text-white">
      <h1 className="text-4xl">Add Category</h1>
      <form onSubmit={addCategory} className="space-y-5 w-full sm:w-[350px]">
        <input
          type="text"
          className="input"
          placeholder="Enter Category name here"
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

export default AddCategory
