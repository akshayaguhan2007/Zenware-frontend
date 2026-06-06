import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  cat: string;
  img: string;
  sizes: string[];
  stock?: number;
  active?: boolean;
};

export function useProducts(includeInactive = false) {
  return useQuery({
    queryKey: ["products", includeInactive],
    queryFn: () => api.get<Product[]>(includeInactive ? "/products?all=true" : "/products"),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => api.get<Product>(`/products/${id}`),
    enabled: !!id,
  });
}

export function useProductsMutations() {
  const qc = useQueryClient();

  const upsert = async (product: Product) => {
    if (product.id && !product.id.startsWith("new")) {
      await api.put(`/products/${product.id}`, product);
    } else {
      await api.post("/products", product);
    }
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const remove = async (id: string) => {
    await api.delete(`/products/${id}`);
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  return { upsert, remove };
}
