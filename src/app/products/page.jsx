'use client'

import { Alert, AlertActions, AlertDescription, AlertTitle } from '@/components/alert'
import { Button } from '@/components/button'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/dialog'
import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Text } from '@/components/text'
import { Textarea } from '@/components/textarea'
import { auth, db } from '@/firebaseConfig'
import { useAuth } from '@clerk/nextjs'
import DeleteIcon from '@mui/icons-material/Delete'
import { signInWithCustomToken } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export default function Products() {
  const [data, setData] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isAlertOpen, setAlertIsOpen] = useState(false)
  const [isProductToDeleteOpen, setProductToDeleteIsOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
  })
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const [productToDelete, setProductToDelete] = useState(null)

  const { getToken, userId } = useAuth()

  const signIntoFirebaseWithClerk = async () => {
    const token = await getToken({ template: 'integration_firebase' })
    await signInWithCustomToken(auth, token || '')
    setToken(token);
  }

  const fetchData = async () => {
    const productsRef = collection(db, 'Products')
    const querySnapshot = await getDocs(productsRef)
    const productsArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    setData(productsArray)
  }

  const SignFirebase = async () => {
    await signIntoFirebaseWithClerk()
    fetchData()
  }

  useEffect(() => {
    if (!userId) {
      return <p>You need to sign in with Clerk to access this page.</p>
    }
    SignFirebase()
  }, [token])

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.imageUrl) {
      setAlertIsOpen(true)
      setError('All fields are required.')
      return
    }

    const priceValue = parseFloat(newProduct.price)
    if (isNaN(priceValue) || priceValue <= 0) {
      setAlertIsOpen(true)
      setError('Please enter a valid price.')
      return
    }

    const productToSave = {
      ...newProduct,
      price: `$${priceValue.toFixed(2)}`,
    }

    setError('')
    try {
      await addDoc(collection(db, 'Products'), productToSave)
      setData([...data, productToSave])
      setIsOpen(false)
      setAlertIsOpen(false)
      setNewProduct({ name: '', description: '', price: '', imageUrl: '' })
    } catch (error) {
      console.error('Error adding product:', error)
      setError('Failed to add product. Please try again.')
      setAlertIsOpen(true)
    }
  }

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteDoc(doc(db, 'Products', productToDelete))
        setData(data.filter((product) => product.id !== productToDelete))
        setProductToDelete(null)
        setProductToDeleteIsOpen(false)
      } catch (error) {
        console.error('Error deleting product:', error)
        setError('Failed to delete product. Please try again.')
        setAlertIsOpen(true)
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-4">
      <Heading level={1} className="mb-4">
        Products
      </Heading>
      <Button type="button" onClick={() => setIsOpen(true)} className="mb-4 bg-gray-800 text-white">
        Add Product
      </Button>

      {error && (
        <Alert open={isAlertOpen} onClose={() => setAlertIsOpen(false)}>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <AlertActions>
            <Button onClick={() => setAlertIsOpen(false)} className="bg-gray-800 text-white">
              Okay
            </Button>
          </AlertActions>
        </Alert>
      )}

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogBody>
          <Input
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="Product Name"
            className="mb-4"
          />
          <Input
            value={newProduct.price}
            type="number"
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            placeholder="Product Price"
            className="mb-4"
          />
          <Textarea
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            placeholder="Product Description"
            className="mb-4"
          />
          <Input
            value={newProduct.imageUrl}
            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
            placeholder="Image URL"
            className="mb-4"
          />
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)} className="bg-gray-800 text-white">
            Cancel
          </Button>
          <Button onClick={handleAddProduct} className="bg-gray-800 text-white">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-lg bg-gray-800 text-white shadow-md">
            {item.imageUrl && <img className="h-48 w-full object-contain" src={item.imageUrl} alt={item.name} />}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <Heading level={2} className="text-xl font-bold">
                  {item.name}
                </Heading>
                <Button
                  onClick={() => {
                    setProductToDelete(item.id)
                    setProductToDeleteIsOpen(true)
                  }}
                  className="rounded-full bg-red-600 p-2 text-white"
                >
                  <DeleteIcon className="h-6 w-6" />
                </Button>
              </div>
              <Divider className="my-2" />
              <Text className="text-gray-300">{item.description}</Text>
              <Text className="font-semibold text-gray-100">{item.price}</Text>
            </div>
          </div>
        ))}
      </div>

      {productToDelete && (
        <Dialog open={isProductToDeleteOpen} onClose={() => setProductToDeleteIsOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogBody>
            <Text>Are you sure you want to delete this product?</Text>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setProductToDeleteIsOpen(false)} className="bg-gray-800 text-white">
              Cancel
            </Button>
            <Button onClick={handleDeleteProduct} className="bg-red-600 text-white">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  )
}
