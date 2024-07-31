import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.tsx'
import ProductPage from './pages/Products.tsx'
import ComponentPage from './pages/Components.tsx'
import OrderPage from './pages/Orders.tsx'
import Product from './pages/Product.tsx'
import Component from './pages/Component.tsx'
import Order from './pages/Order.tsx'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { allComponentsLoader, allOrdersLoader, allProductsLoader } from './loaderFunctions.ts'

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
      },
      {
        path: '/products',
        element: <ProductPage />,
        loader: allProductsLoader,
      },
      {
        path: '/parts',
        element: <ComponentPage />,
        loader: allComponentsLoader,
      },
      {
        path: '/orders',
        element: <OrderPage />,
        loader: allOrdersLoader,
      },
      {
        path: 'products/:productID',
        element: <Product />,
      },
      {
        path: 'parts/:partID',
        element: <Component />,
      },
      {
        path: 'orders/:orderID',
        element: <Order />,
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
