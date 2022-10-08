import Menu from "./components/Menu"
import Admin from "./components/Admin"
import AddMenuItem from "./components/AddMenuItem"
import AddCategory from "./components/AddCategory"
import { useEffect, useState } from "react"
import { Route, Routes, BrowserRouter as Router } from "react-router-dom"

function App() {
  const [items, setItems] = useState([
    {
      _id: "fewifoe",
      name: "Chicken Sandwich",
      category: { name: "Sandwiches" },
    },
  ])

  useEffect(() => {
    console.log("Get the menu data (not implemented)")
  }, [])

  return (
    <div className="text-xl bg-gray-900">
      <Router>
        <Routes>
          <Route path="/" element={<Menu items={items} />} />
          <Route path="/admin">
            <Route element={<AddMenuItem />} path="/admin/menuitem/add" />
            <Route element={<AddCategory />} path="/admin/category/add" />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
