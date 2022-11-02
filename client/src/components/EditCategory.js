import React, { useState } from 'react'
import axios from 'axios'

function EditCategory() {
  const [name, setName] = useState('')
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')

  const onChangeName = (e) => {
    setName(e.target.value)
  }

  const addCategory = async (e) => {
    setSuccess(null)
    e.preventDefault()
    try {
      setLoading(true)
      await axios.post('http://localhost:5000/api/admin/category/', {
        name,
      })
      setSuccess(true)
    } catch (e) {
      setSuccess(false)
      setError(e.response.data.errors)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col justify-start items-center space-y-10 text-white">
      <h1 className="text-4xl p-5 m-5">Add Category</h1>
      {success && (
        <p className="text-green-500 bg-green-200 p-2 px-3 rounded">
          Everything went ok
        </p>
      )}{' '}
      {error.length > 1 && success === false && (
        <p className="text-red-500 bg-red-200 p-2 px-3 rounded">{error}</p>
      )}
      <form onSubmit={addCategory} className="space-y-10 w-full sm:w-[350px]">
        <input
          type="text"
          className="input"
          placeholder="Enter Category name here"
          value={name}
          onChange={onChangeName}
        />
        <div>
          <button
            disabled={!!loading}
            type="submit"
            className="bg-[#44aa04] text-white input"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditCategory
