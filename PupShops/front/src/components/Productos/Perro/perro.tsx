"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cartContext } from "@/context/cartContext";
import { IProduct } from "@/Interfaces/ICart";
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 6;

const PerroGeneral: React.FC = () => {
  const router = useRouter();
  const { addToCart } = useContext(cartContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryId = "7b308d63-51d6-4af1-8d42-722647c71031";

  const [quantity, setQuantity] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/products/category/${categoryId}`
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Error ${response.status}: ${errorMessage}`);
        }

        const data: IProduct[] = await response.json();
        console.log(data);

        const formattedData = data.map((product) => ({
          ...product,
          price: Number(product.price),
        }));

        setProducts(formattedData);
        const initialQuantity = formattedData.reduce((acc, product) => {
          acc[product.id] = 1;
          return acc;
        }, {} as { [key: number]: number });
        setQuantity(initialQuantity);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loading) return <div>Cargando productos...</div>;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const updateQuantity = (
    productId: number,
    operation: "increment" | "decrement"
  ) => {
    setQuantity((prevQuantities) => ({
      ...prevQuantities,
      [productId]:
        operation === "increment"
          ? (prevQuantities[productId] || 1) + 1
          : Math.max((prevQuantities[productId] || 1) - 1, 1),
    }));
  };

  return (
    <div className="container mx-auto mt-10 p-4 bg-slate-50">
      <div className="bg-teal-600 rounded-lg text-center p-2 m-2 hover:bg-orange-300">
        <span>NO TE OLVIDES QUE COMPRANDO ARRIBA DE LOS $100 TENES EL 10% DE DESCUENTO</span>
      </div>
      <h1 className="text-2xl text-center font-bold mb-4">Productos para Perro</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded-lg shadow-md cursor-pointer flex flex-col justify-between h-full"
            onClick={() => router.push("/Categorias/Ropa/Gato")}
          >
            <div className="flex flex-col items-center">
              <Image
                src={product.imgUrl}
                alt={product.name}
                width={300}
                height={300}
                className="object-contain rounded-md w-full h-60 mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-700 mb-2">{product.description}</p>
              <p className="text-green-600 font-bold mb-2">
                ${product.price.toFixed(2)}
              </p>
              <div className="flex items-center space-x-4 mb-4">
                <button
                  className="px-3 py-1 bg-gray-300 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, "decrement");
                  }}
                >
                  -
                </button>
                <span>{quantity[product.id] || 1}</span>
                <button
                  className="px-3 py-1 bg-gray-300 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, "increment");
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <button
              className="mt-auto bg-teal-600 text-white py-2 rounded-md hover:bg-orange-300 hover:text-black transition"
              onClick={async (e) => {
                e.stopPropagation();
                const currentQuantity = quantity[product.id] || 1;
                console.log("Adding to cart:", product.id, currentQuantity);
                const success = await addToCart(product.id, currentQuantity);

                if (success) {
                  Swal.fire({
                    title: "¡Producto Agregado!",
                    text: `${currentQuantity} unidades de ${product.name} han sido agregadas al carrito.`,
                    icon: "success",
                    confirmButtonText: "Aceptar",
                  });
                } else {
                  alert("Error al agregar al carrito");
                }
              }}
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === index + 1
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PerroGeneral;
