import Menu from './components/Menu'
import AddMenuItem from './components/AddMenuItem'
import AddCategory from './components/AddCategory'
import AddIngredient from './components/AddIngredient'
import React, { useEffect, useState } from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import axios from 'axios'

function App() {
  const [items, setItems] = useState([
    {
      _id: 'fewifoe',
      name: 'Chicken Sandwich',
      category: { name: 'Sandwiches' },
    },
  ])

  useEffect(() => {
    ;(async () => {
      const itemsResult = await axios.get('/api/menu/items')
      setItems(itemsResult.data.items)
    })()
  }, [])

  return (
    <div className="text-xl bg-gray-900">
      <Router>
        <Routes>
          <Route path="/" element={<Menu items={items} />} />
          <Route path="/admin">
            <Route element={<AddMenuItem />} path="/admin/menuitem/add" />
            <Route element={<AddCategory />} path="/admin/category/add" />
            <Route element={<AddIngredient />} path="/admin/ingredient/add" />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
