/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import CurrencyFormat from 'react-currency-format'
import _ from 'lodash'

export default function Menu({ items }) {
  // eslint-disable-next-line no-unused-vars
  const [itemsByCategory, setItemsByCategory] = useState([])

  useEffect(() => {
    // group by category
    const groupedItems = _.groupBy(items, 'category.name')
    setItemsByCategory(groupedItems)
  }, [items])

  return (
    <div className="h-screen w-full text-white flex flex-col justify-start p-5">
      {Object.keys(itemsByCategory).map((category) => {
        const items = itemsByCategory[category]
        return (
          <>
            <h1 className="text-4xl underline hover:text-orange-400 transition duration-300 pt-5">
              {category.toUpperCase()}
            </h1>
            {items.map((item) => (
              <div
                key={item._id}
                className="flex flex-row items-center pl-5 p-5 tracking-[3px] space-x-5"
              >
                <img
                  src="https://iso.500px.com/wp-content/uploads/2015/03/business_cover.jpeg"
                  alt=""
                  className="w-[100px] h-[100px] object-cover"
                />
                <div className="flex flex-row">
                  <p className="text-md mr-3">{item.name.toUpperCase()}</p>
                  <CurrencyFormat
                    displayType={'text'}
                    thousandSeparator={true}
                    value={item.price}
                    renderText={(value) => <p>{value}</p>}
                    suffix=" LBP"
                  />
                </div>
                {item.ingredients.length > 0 ? (
                  <div className="text-sm flex flex-row space-x-3">
                    <h4>Ingredients: </h4>
                    {item.ingredients.map((ingredient, index) => (
                      <p key={ingredient._id}>
                        {ingredient.name}
                        {index + 1 < item.ingredients.length ? ',' : ''}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </>
        )
      })}
    </div>
  )
}
