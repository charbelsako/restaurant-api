/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import axios from 'axios'
import makeAnimated from 'react-select/animated'
import { useParams } from 'react-router-dom'
// import FormData from 'form-data'

function EditMenuItem() {
  const { id } = useParams()

  const [currentCategory, setCurrentCategory] = useState(0)
  const [currentIngredient, setCurrentIngredient] = useState(0)

  const animatedComponents = makeAnimated()
  const [categoryOptions, setCategoryOptions] = useState([
    { value: null, label: 'Choose a category' },
  ])
  const [ingredientOptions, setIngredientOptions] = useState([])
  const [price, setPrice] = useState(0)
  const [name, setName] = useState('')
  const [category, setCategory] = useState(categoryOptions[0].value)
  const [ingredients, setIngredient] = useState([])

  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')
  const [itemImage, setItemImage] = useState(null)

  useEffect(() => {
    ;(async () => {
      const categories = await axios.get('/api/menu/categories')
      setCategoryOptions(
        categories.data.categories.map((obj) => ({
          value: obj._id,
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
      // Select the ingredients and categories that belong the requested item
      const currentItem = await axios.get(`/api/admin/menuitem/${id}`)
      console.log(currentItem.data.name)
      setName(currentItem.data.name)
      setPrice(currentItem.data.price)

      setIngredient(currentItem.data.ingredients)
      setCategory(currentItem.data.category.name)

      const categoryIndex = categories.data.categories.findIndex(
        (el) => el._id === currentItem.data.category._id
      )
      setCurrentCategory(categoryIndex)

      const ingredientIndex = ingredients.data.ingredients.findIndex(
        (el) => el._id === currentItem.data.ingredients._id
      )
      setCurrentIngredient(ingredientOptions[ingredientIndex])
    })()
  }, [])

  const onChangePrice = (e) => {
    setPrice(e.target.value)
  }
  const onChangeCategory = (newValue) => {
    setCategory(newValue.value)
  }
  const onChangeIngredient = (newValue) => {
    setIngredient([...ingredients, newValue[0].value])
  }
  const onChangeName = (e) => {
    setName(e.target.value)
  }
  const onChangeImage = (e) => {
    setItemImage(e.target.files[0])
  }

  const editMenuItem = async (e) => {
    e.preventDefault()

    try {
      const data = new FormData()
      if (itemImage) {
        data.append('itemImage', itemImage, itemImage.name)
      }
      data.append('name', name)
      data.append('price', price)
      data.append('category', category)
      data.append('ingredients', ingredients)
      setLoading(true)
      await axios.post(`http://localhost:5000/api/admin/menuitem/${id}`, data)
      setSuccess(true)
    } catch (e) {
      setSuccess(false)
      if (e.response) {
        setError(e.response.data.errors)
      }
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-start h-screen items-center text-white space-y-10">
      <h1 className="text-4xl p-5 m-5">Edit Menu Item</h1>
      {success && (
        <p className="text-green-500 bg-green-200 p-2 px-3 rounded">
          Everything went ok
        </p>
      )}
      {error && !success && (
        <p className="text-red-500 bg-red-200 p-2 px-3 rounded">{error}</p>
      )}
      <form onSubmit={editMenuItem} className="space-y-10 w-full sm:w-[550px]">
        <input
          type="text"
          className="input"
          placeholder="Enter Item name here"
          defaultValue={name}
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
          value={categoryOptions[currentCategory]}
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
          defaultValue={ingredientOptions[currentIngredient]}
          onChange={onChangeIngredient}
          className="text-black"
          styles={{
            control: (styles) => ({
              ...styles,
              padding: '8px',
            }),
          }}
        />
        <input
          type="file"
          name="itemImage"
          id="itemImage"
          onChange={onChangeImage}
        />
        <div>
          <button
            disabled={!!loading}
            type="submit"
            className="bg-[#44aa04] text-white input"
          >
            Update Item
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditMenuItem
