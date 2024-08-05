"use client"
import React, { useEffect, useState } from 'react'
import { doc, getDocs, collection, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { db } from '../../../firebase'

function PantryItems() {
    const [pantryItems, setPantryItems] = useState([])
    const [itemName, setItemName] = useState('')
    const [error, setError] = useState(null)
    const [open, setOpen] = useState(false)

    // Fetch pantry items from Firestore
    const updatePantry = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'pantry'))
            const items = querySnapshot.docs.map(doc => ({
                name: doc.id,
                ...doc.data()
            }))
            setPantryItems(items)
        } catch (err) {
            console.error("Error fetching pantry items:", err)
            setError(err.message || "Unknown error occurred")
        }
    }

    useEffect(() => {
        updatePantry()
    }, [])

    // Add or update an item in the Firestore collection
    const addItem = async (item) => {
        if (item.trim() === '') return

        try {
            const docRef = doc(collection(db, 'pantry'), item)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const { quantity } = docSnap.data()
                await setDoc(docRef, { quantity: quantity + 1 })
            } else {
                await setDoc(docRef, { quantity: 1 })
            }
            updatePantry()
        } catch (err) {
            console.error("Error adding item:", err)
            setError(err.message || "Unknown error occurred")
        }
    }

    // Remove or decrease the quantity of an item in the Firestore collection
    const removeItem = async (item) => {
        try {
            const docRef = doc(collection(db, 'pantry'), item)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const { quantity } = docSnap.data()
                if (quantity === 1) {
                    await deleteDoc(docRef)
                } else {
                    await setDoc(docRef, { quantity: quantity - 1 })
                }
                updatePantry()
            }
        } catch (err) {
            console.error("Error removing item:", err)
            setError(err.message || "Unknown error occurred")
        }
    }

    const handleItem = (e) => setItemName(e.target.value)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            {/* Modal for Adding Items */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-8">
                        <h2 className="text-2xl mb-4">Add Item</h2>
                        <div className="flex space-x-4">
                            <input
                                type="text"
                                placeholder="Item"
                                value={itemName}
                                onChange={handleItem}
                                className="border border-gray-300 rounded-md p-2 w-full"
                            />
                            <button
                                onClick={() => {
                                    addItem(itemName)
                                    setItemName('')
                                    handleClose()
                                }}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <button
                onClick={handleOpen}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
            >
                Add New Item
            </button>
            <div className="w-full max-w-2xl border rounded-lg border-gray-300">
                <div className="bg-blue-500 border rounded-lg text-white py-4 flex justify-center">
                    <h2 className="text-3xl">Pantry Items</h2>
                </div>
                <div className="p-4">
                    {error ? (
                        <p className="text-red-500">Error: {error}</p>
                    ) : (
                        <div className="space-y-4 overflow-y-auto max-h-80">
                            {pantryItems.map(({ name, quantity }) => (
                                <div
                                    key={name}
                                    className="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
                                >
                                    <span className="text-xl">{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                                    <span className="text-xl">Quantity: {quantity}</span>
                                    <button
                                        onClick={() => removeItem(name)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PantryItems
