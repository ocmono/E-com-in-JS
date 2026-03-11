/**
 * Optimized Product Detail Page
 */

import { useState, useEffect, useRef, useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { getProductBySlug } from "../api/productApi.js"
import { getProduct as getProductById, listVariations } from "../api/productVaration.js"
import { useCartStore } from "../stores/cartStore.js"

// Normalize images to URL array (API returns [{ alt_name, img_url }])
function imageUrls(images) {
  if (!images?.length) return []
  return images.map((img) => (typeof img === "string" ? img : img?.img_url)).filter(Boolean)
}

// Normalize product attributes: API returns [{ name, variations: [] }] -> { [name]: values[] }
function attributesToMap(attrs) {
  if (!attrs?.length) return {}
  if (!Array.isArray(attrs)) return typeof attrs === "object" ? attrs : {}
  return Object.fromEntries(
    attrs.map((a) => [a.name, a.variations ?? []]).filter(([_, v]) => Array.isArray(v))
  )
}

// Variation has attributes: [{ name, variation }] -> get value by name
function getVariationAttr(variant, name) {
  const item = variant?.attributes?.find((a) => a.name === name)
  return item?.variation ?? ""
}

export function Product() {

  const { slug } = useParams()
  const addItem = useCartStore((s) => s.addItem)

  const [selectedVariant, setSelectedVariant] = useState(null)
  const [imageIndex, setImageIndex] = useState(0)

  const intervalRef = useRef(null)

  const isId = /^\d+$/.test(slug)

  /*
  -----------------------------------
  FETCH PRODUCT
  -----------------------------------
  */

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () =>
      slug
        ? isId
          ? getProductById(slug)
          : getProductBySlug(slug)
        : Promise.reject(new Error("No slug")),
    staleTime: 60000,
    retry: false,
  })

  const product = data?.data ?? data

  // Fetch variations when we have a product id (real API returns product without variants)
  const { data: variationsData } = useQuery({
    queryKey: ["product-variations", product?.id],
    queryFn: () => listVariations({ product_id: product.id }),
    enabled: !!product?.id,
    staleTime: 60000,
  })

  const variationsList = variationsData?.data ?? variationsData ?? []

  /*
  -----------------------------------
  DERIVED DATA (support both API shapes: with/without variations)
  -----------------------------------
  */

  const variants = product?.variants ?? variationsList
  const attributes = useMemo(
    () => attributesToMap(product?.attributes) ?? {},
    [product?.attributes]
  )
  const attrNames = Object.keys(attributes)

  const images = useMemo(() => {
    if (selectedVariant?.images?.length) {
      return imageUrls(selectedVariant.images)
    }
    return imageUrls(product?.images) ?? []
  }, [product?.images, selectedVariant?.images])

  const displayPrice =
    selectedVariant?.price ?? product?.base_price ?? product?.price ?? 0
  const displayStock =
    selectedVariant?.stock ?? product?.base_stock ?? product?.stock ?? 0

  /*
  -----------------------------------
  VARIANT FINDER (variation.attributes = [{ name, variation }])
  -----------------------------------
  */

  const findVariant = (selections) => {
    return variants.find((v) =>
      attrNames.every(
        (name) => getVariationAttr(v, name) === (selections[name] ?? "")
      )
    )
  }

  const currentSelections = useMemo(() => {
    if (!selectedVariant) return {}
    return Object.fromEntries(
      attrNames.map((name) => [name, getVariationAttr(selectedVariant, name)])
    )
  }, [selectedVariant, attrNames])

  const updateSelection = (attrName, value) => {
    const next = { ...currentSelections, [attrName]: value }
    const variant = findVariant(next)
    setSelectedVariant(variant)
  }

  /*
  -----------------------------------
  ADD TO CART
  -----------------------------------
  */

  const handleAddToCart = () => {
    if (!product) return
    const variant = selectedVariant || variants[0]
    const price =
      variant?.price ?? product.base_price ?? product.price ?? 0
    addItem({
      productId: product.id,
      variantId: variant?.id,
      quantity: 1,
      product,
      variant,
      price,
    })
  }

  /*
  -----------------------------------
  IMAGE SLIDER
  -----------------------------------
  */

  const AUTO_SLIDE = 4000

  useEffect(() => {

    if (!images.length || images.length < 2) return

    intervalRef.current = setInterval(() => {
      setImageIndex((i) => (i >= images.length - 1 ? 0 : i + 1))
    }, AUTO_SLIDE)

    return () => clearInterval(intervalRef.current)

  }, [images])

  const goToSlide = (index) => {

    setImageIndex(index)

    clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setImageIndex((i) => (i >= images.length - 1 ? 0 : i + 1))
    }, AUTO_SLIDE)
  }

  const goNext = () =>
    goToSlide(imageIndex >= images.length - 1 ? 0 : imageIndex + 1)

  const goPrev = () =>
    goToSlide(imageIndex <= 0 ? images.length - 1 : imageIndex - 1)

  /*
  -----------------------------------
  LOADING STATE
  -----------------------------------
  */

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-4">
        <div className="animate-pulse flex gap-8">
          <div className="w-96 h-96 bg-neutral-200 rounded-lg" />
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-neutral-200 rounded w-3/4" />
            <div className="h-4 bg-neutral-200 rounded w-1/2" />
            <div className="h-4 bg-neutral-200 rounded w-full" />
          </div>
        </div>
      </div>
    )
  }

  /*
  -----------------------------------
  ERROR STATE
  -----------------------------------
  */

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold mb-3">Product not found</h1>

        <Link
          to="/catalog"
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Back to catalog
        </Link>
      </div>
    )
  }

  /*
  -----------------------------------
  UI
  -----------------------------------
  */

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      <div className="flex flex-col md:flex-row gap-10">

        {/* IMAGE SLIDER */}

        <div className="w-full md:w-96 aspect-square bg-neutral-100 rounded-lg overflow-hidden relative">

          {images.length ? (
            <>
              <div
                className="flex h-full transition-transform duration-300"
                style={{
                  width: `${images.length * 100}%`,
                  transform: `translateX(-${imageIndex * (100 / images.length)}%)`,
                }}
              >
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 h-full"
                    style={{ width: `${100 / images.length}%` }}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full"
                  >
                    ‹
                  </button>

                  <button
                    onClick={goNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full"
                  >
                    ›
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-400">
              No Image
            </div>
          )}
        </div>

        {/* PRODUCT INFO */}

        <div className="flex-1">

          <h1 className="text-2xl font-bold mb-3">
            {product.title}
          </h1>

          <p className="text-2xl font-semibold mb-4">
            ${displayPrice.toFixed(2)}
          </p>

          <p className="text-neutral-600 mb-6">
            {product.description}
          </p>

          {/* ATTRIBUTES (only when product has variations) */}

          {variants.length > 0 &&
            attrNames.map((attr) => (
              <div key={attr} className="mb-4">
                <p className="font-medium mb-2">{attr}</p>
                <div className="flex gap-2 flex-wrap">
                  {attributes[attr].map((val) => (
                    <button
                      key={val}
                      onClick={() => updateSelection(attr, val)}
                      className={`px-4 py-2 border rounded-md ${
                        currentSelections[attr] === val
                          ? "bg-black text-white"
                          : "hover:border-neutral-500"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          {/* ADD TO CART */}

          {displayStock > 0 ? (
            <button
              onClick={handleAddToCart}
              className="mt-6 bg-black text-white px-6 py-3 rounded-md"
            >
              Add to Cart
            </button>
          ) : (
            <p className="text-red-500 font-medium">Out of stock</p>
          )}
        </div>

      </div>
    </div>
  )
}