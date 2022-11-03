import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function EditCategory() {
  const { id } = useParams()
  const [name, setName] = useState('')
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      const category = await axios.get(`/api/admin/category/${id}`)
      setName(category.data.name)
    })()
  }, [])

  const onChangeName = (e) => {
    setName(e.target.value)
  }

  const editCategory = async (e) => {
    setSuccess(null)
    e.preventDefault()
    try {
      setLoading(true)
      await axios.put(`/api/admin/category/${id}`, {
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
      <h1 className="text-4xl p-5 m-5">Edit Category</h1>
      {success && (
        <p className="text-green-500 bg-green-200 p-2 px-3 rounded">
          Everything went ok
        </p>
      )}{' '}
      {error.length > 1 && success === false && (
        <p className="text-red-500 bg-red-200 p-2 px-3 rounded">{error}</p>
      )}
      <form onSubmit={editCategory} className="space-y-10 w-full sm:w-[350px]">
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
            Update Category
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditCategory
