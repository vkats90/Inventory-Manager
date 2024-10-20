import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Home from './pages/Home.tsx'
import ProductPage from './pages/Products.tsx'
import AddProduct from './pages/AddProduct.tsx'
import ComponentPage from './pages/Components.tsx'
import OrderPage from './pages/Orders.tsx'
import Login from './pages/login.tsx'
import Product from './pages/Product.tsx'
import Component from './pages/Component.tsx'
import Order from './pages/Order.tsx'
import AddOrder from './pages/AddOrder.tsx'
import AddComponent from './pages/AddComponent.tsx'
import SignUp from './pages/SignUp.tsx'
import ReleaseNotes from './pages/Version-release.tsx'
import NoLocation from './pages/NoLocation.tsx'
import CreateLocation from './pages/CreateLocation.tsx'
import ErrorElement from './pages/errorElement.tsx'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import {
  allComponentsLoader,
  allOrdersLoader,
  allProductsLoader,
  homeLoader,
  findComponentLoader,
  findProductLoader,
  findOrderLoader,
  appLoader,
  allProductsandComponentsLoader,
} from './loaderFunctions.ts'
import {
  addComponent,
  addOrder,
  addProduct,
  login,
  register,
  changeCurrentLocation,
  addLocation,
} from './actionFunctions.ts'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
})

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorElement />,
    element: <App />,
    loader: appLoader,
    action: changeCurrentLocation,
    children: [
      {
        path: '/',
        element: <Home />,
        loader: homeLoader,
      },
      {
        path: '/auth/google/callback',
        element: <Navigate to="/" replace />,
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
          {
            path: '/products/add-product',
            loader: allComponentsLoader,
            element: <AddProduct />,
            action: addProduct,
          },
        ],
      },
      {
        path: '/login',
        element: <Login />,
        action: login,
      },
      {
        path: '/register',
        element: <SignUp />,
        action: register,
      },
      {
        path: '/no-location',
        element: <NoLocation />,
      },
      {
        path: '/create-location',
        element: <CreateLocation />,
        action: addLocation,
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
            action: addComponent,
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
          {
            path: '/orders/add-order',
            element: <AddOrder />,
            action: addOrder,
            loader: allProductsandComponentsLoader,
          },
        ],
      },
      {
        path: '/version-release',
        element: <ReleaseNotes />,
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
