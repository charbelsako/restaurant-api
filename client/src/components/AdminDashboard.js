import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CurrencyFormat from 'react-currency-format'

function AdminDashboard() {
  const [categories, setCategories] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    const fetchAllData = async () => {
      const ingredientsResult = await axios.get('/api/menu/ingredients')
      const categoriesResult = await axios.get('/api/menu/categories')
      const itemsResult = await axios.get('/api/menu/items')

      const categoriesData = categoriesResult.data.categories
      const ingredientsData = ingredientsResult.data.ingredients
      const itemsData = itemsResult.data.items

      setCategories(categoriesData)
      setIngredients(ingredientsData)
      setMenuItems(itemsData)
    }

    fetchAllData().catch((e) => console.error(e))
  }, [])

  const deleteMenuItem = async (e) => {
    const id = e.target.dataset.id
    await axios.delete(`/api/admin/menuitem/${id}`)
    setMenuItems([...menuItems.filter((value) => value._id !== id)])
  }

  const deleteCategory = async (e) => {
    const id = e.target.dataset.id
    await axios.delete(`/api/admin/category/${id}`)
    setCategories([...categories.filter((value) => value._id !== id)])
  }

  const deleteIngredient = async (e) => {
    const id = e.target.dataset.id
    await axios.delete(`/api/admin/ingredient/${id}`)
    setIngredients([...ingredients.filter((value) => value._id !== id)])
  }

  return (
    <div className="text-white w-screen flex flex-col justify-start space-y-10 items-center min-h-screen pb-24">
      <h1 className="text-4xl p-5 m-5">Admin Dashboard</h1>
      <h2 className="dashboard-title">Menu Items</h2>
      {menuItems.map((item) => (
        <div key={item._id} className="admin-section">
          <h3 className="text-md">{item.name}</h3>
          <h3 className="text-md pl-5">
            <CurrencyFormat
              displayType={'text'}
              thousandSeparator={true}
              value={item.price}
              renderText={(value) => <p>{value}</p>}
              suffix=" LBP"
            />
          </h3>
          <button
            className="bg-red-700 rounded p-3 ml-auto"
            onClick={deleteMenuItem}
            data-id={item._id}
          >
            Delete
          </button>
          <a
            href={`/admin/menuitem/edit/${item._id}`}
            className="bg-cyan-700 rounded p-3 ml-3"
          >
            Edit
          </a>
        </div>
      ))}
      <h2 className="dashboard-title">Categories</h2>
      {categories.map((category) => (
        <div key={category._id} className="admin-section">
          <h3 className="text-md">{category.name}</h3>
          <button
            className="bg-red-700 rounded p-3 ml-auto"
            onClick={deleteCategory}
            data-id={category._id}
          >
            Delete
          </button>
          <button className="bg-cyan-700 rounded p-3 ml-3">Edit</button>
        </div>
      ))}
      <h2 className="dashboard-title">Ingredients</h2>
      {ingredients.map((ingredient) => (
        <div key={ingredient._id} className="admin-section">
          <h3 className="text-md">{ingredient.name}</h3>
          <button
            className="bg-red-700 rounded p-3 ml-auto"
            onClick={deleteIngredient}
            data-id={ingredient._id}
          >
            Delete
          </button>
          <button className="bg-cyan-700 rounded p-3 ml-3">Edit</button>
        </div>
      ))}
    </div>
  )
}

export default AdminDashboard
