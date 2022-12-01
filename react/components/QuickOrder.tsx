import React, { useState, useEffect } from 'react'
import { useLazyQuery, useMutation } from 'react-apollo'
import UPDATE_CART from '../graphql/updateCart.graphql'
import GET_PRODUCT from '../graphql/getProductBySku.graphql'

const QuickOrder = () => {
  const [inputText, setInputText] = useState("")
  const [search, setSearch] = useState("")
  const [getProductData, { data: product }] = useLazyQuery(GET_PRODUCT)
  const [addToCart] = useMutation(UPDATE_CART)

  const handleChange = (evt: any) => {
    setInputText(evt.target.value)
    console.log("input change", inputText)
  }

  useEffect(() => {
    console.log("el sku es", product, search);
    if (!product) {
      let skuId = parseInt(inputText)
      addToCart({
        variables: {
          salesChannel: "1",
          items: [
            {
              id: skuId,
              quantity: 1,
              seller: "1"
            }
          ]
        }
      })
        .then(() => {
          window.location.href = "/checkout"
        })
    }
  }, [product, search])

  const addProductToCart = () => {
    getProductData({
      variables: {
        sku: inputText
      }
    })
    console.log("añadiendo al carro", search)
  }
  const searchProduct = (evt: any) => {
    evt.preventDefault()
    if (!inputText) {
      alert("ingresar")
    } else {
      console.log("haciendo busqueda", inputText);
      setSearch(inputText)
      addProductToCart()
    }
  }
  return (
    <div>
      <h2>Compra rapida</h2>
      <form onSubmit={searchProduct}>
        <div>
          <label htmlFor='sku'>Ingrese el numero sku</label>
          <input id="sku" type="text" onChange={handleChange}></input>
        </div>
        <input type="submit" value="Añadir al carrito" />
      </form>
    </div>
  )
}

export default QuickOrder
