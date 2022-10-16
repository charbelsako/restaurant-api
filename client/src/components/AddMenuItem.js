import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import axios from 'axios'
import makeAnimated from 'react-select/animated'

function AddMenuItem() {
  const animatedComponents = makeAnimated()
  const [categoryOptions, setCategoryOptions] = useState([
    { value: null, label: 'Choose a category' },
  ])
  const [ingredientOptions, setIngredientOptions] = useState([])
  const [price, setPrice] = useState(0)
  const [name, setName] = useState('')
  const [category, setCategory] = useState(categoryOptions[0].value)
  const [ingredient, setIngredient] = useState()

  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      const categories = await axios.get('/api/menu/categories')
      setCategoryOptions(
        categories.data.categories.map((obj) => ({
          value: obj.name,
          label: obj.name,
        }))
      )
      const ingredients = await axios.get('/api/menu/ingredients')
      setIngredientOptions(
        ingredients.data.ingredients.map((obj) => ({
          value: obj._id,
          label: obj.name,
        }))
      )
    })()
  }, [])

  const onChangePrice = (e) => {
    setPrice(e.target.value)
  }
  const onChangeCategory = (newValue) => {
    setCategory(newValue.value)
  }
  const onChangeIngredient = (newValue) => {
    setIngredient(newValue.value)
  }
  const onChangeName = (e) => {
    setName(e.target.value)
  }

  const addMenuItem = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await axios.post('http://localhost:5000/api/admin/menuitem/', {
        name,
        price,
        category,
        ingredient,
      })
      setSuccess(true)
    } catch (e) {
      setSuccess(false)
      setError(e.response.data.errors)
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-start h-screen items-center text-white space-y-10">
      <h1 className="text-4xl p-5 m-5">Add Menu Item</h1>
      {success && (
        <p className="text-green-500 bg-green-200 p-2 px-3 rounded">
          Everything went ok
        </p>
      )}
      {error && !success && (
        <p className="text-red-500 bg-red-200 p-2 px-3 rounded">{error}</p>
      )}
      <form onSubmit={addMenuItem} className="space-y-10 w-full sm:w-[550px]">
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
          options={categoryOptions}
          defaultValue={categoryOptions[0]}
          onChange={onChangeCategory}
          className="text-black"
          styles={{
            control: (styles) => ({
              ...styles,
              padding: '8px',
            }),
          }}
        />
        <Select
          closeMenuOnSelect={false}
          isMulti
          options={ingredientOptions}
          components={animatedComponents}
          defaultValue={ingredientOptions[0]}
          onChange={onChangeIngredient}
          className="text-black"
          styles={{
            control: (styles) => ({
              ...styles,
              padding: '8px',
            }),
          }}
        />
        {/* Images?? */}
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

export default AddMenuItem
