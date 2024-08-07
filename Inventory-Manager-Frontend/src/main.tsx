import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.tsx'
import ProductPage from './pages/Products.tsx'
import ComponentPage from './pages/Components.tsx'
import OrderPage from './pages/Orders.tsx'
import Login from './pages/login.tsx'
import Product from './pages/Product.tsx'
import Component from './pages/Component.tsx'
import Order from './pages/Order.tsx'
import AddComponent from './pages/AddComponent.tsx'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import {
  allComponentsLoader,
  allOrdersLoader,
  allProductsLoader,
  homeLoader,
  findComponentLoader,
  findProductLoader,
  findOrderLoader,
} from './loaderFunctions.ts'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
})

const router = createBrowserRouter([
  {
    path: '/',

    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
        loader: homeLoader,
      },
      {
        path: '/products',
        element: <ProductPage />,
        loader: allProductsLoader,
        children: [
          {
            path: '/products/:productID',
            element: <Product />,
            loader: findProductLoader,
          },
        ],
      },
      {
        path: '/login',
        element: <Login />,
        loader: () => {
          window.localStorage.clear()
          return ''
        },
      },
      {
        path: '/parts',
        element: <ComponentPage />,
        loader: allComponentsLoader,
        children: [
          {
            path: '/parts/:partID',
            element: <Component />,
            loader: findComponentLoader,
          },
          {
            path: '/parts/add-part',
            element: <AddComponent />,
          },
        ],
      },
      {
        path: '/orders',
        element: <OrderPage />,
        loader: allOrdersLoader,
        children: [
          {
            path: '/orders/:orderID',
            element: <Order />,
            loader: findOrderLoader,
          },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
)
