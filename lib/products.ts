import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

function mapRow(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    price: Number(row.price),
    cat: row.category ?? "Fashion",
    img: row.image_url ?? "",
    sizes: Array.isArray(row.sizes) ? row.sizes : (row.sizes ?? "S,M,L").split(",").map((s: string) => s.trim()),
    stock: row.stock,
    active: row.active,
  };
}

export function useProducts(includeInactive = false) {
  return useQuery({
    queryKey: ["products", includeInactive],
    queryFn: async () => {
      let q = supabase.from("products").select("*").order("created_at", { ascending: false });
      if (!includeInactive) q = q.eq("active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? mapRow(data) : null;
    },
    enabled: !!id,
  });
}
