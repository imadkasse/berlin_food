"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Star,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  MoreHorizontal,
  Download,
  UtensilsCrossed,
  PlusCircle,
  FolderPlus,
} from "lucide-react";
import CreateMenuItemModal from "./CreateMenuItemModal";
import EditMenuItemModal from "./EditMenuItemModal";
import DeleteMenuItemModal from "./DeleteMenuItemModal";
import CreateCategoryModal from "./CreateCategoryModal";
import { Menu } from "@/types/Menu";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: { label: string; dark?: boolean };
  inStock: boolean;
}

interface InventoryRow {
  id: number;
  name: string;
  image: string;
  category: string;
  price: number;
  orders: number;
  active: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INVENTORY: InventoryRow[] = [
  {
    id: 1,
    name: "Heirloom Garden Salad",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpize8z75XQXbe2ledmjDda7sIB4YdoikHO4rRCBGbRS5jeKCgZT7Uk8Pc1RyuTFQaNsJwzpaXPFgVmF0P2cDfzmSAlsNBN6IX8PF1zNc4u9jPBGXRH5l-MQUJtu49zJ55eqqCmYxBY7C3sJlle9sAGGBKl6jEFdYymy83ybxkhwRcuAxnG-f4oFc7VAIf3NG22TVdDfEQpnh4LsFbBGo-PXVPlklpB2bWA3_SQb4jC1TpGNw1vVRxYbrLcU0D8u0I6nCpM3XFFKZG",
    category: "Appetizer",
    price: 16,
    orders: 412,
    active: true,
  },
  {
    id: 2,
    name: "Reserve Wagyu Burger",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7lZbbnul5DWQCbZFuTffUr5w4S1rBVGI38ep3JVnoPE-tTXjRszzNuj4GpJB3mpcFyUA5pMuJ0mljLrtZ4ZF4ZUtLouOmbaaX5PGtdQZZCxAEIwBZKbfg-R_-wbDhsgyzOsHi0xWUNB9xuwaInEEoNmAVeGadtfdh8Ph_1R1iLv7h99zg0NmDrkaVp6Fd7T8Ng0YJRPa6kDoQ9nIye3_bkE6Sptpa2KkTF7rUezBk8LXEGwyrEksmE6NeE_-D9wy7obAu0pjOUki-",
    category: "Main Course",
    price: 34,
    orders: 890,
    active: true,
  },
];

const STATS = [
  {
    label: "Total Items",
    value: "124",
    badge: "+4 this month",
    icon: null,
  },
  {
    label: "Active Menu",
    value: "86%",
    icon: <UtensilsCrossed size={22} className="text-[#F27121] opacity-40" />,
  },
  {
    label: "Top Category",
    value: "Signature Grills",
    icon: <Star size={18} className="text-yellow-500" fill="currentColor" />,
  },
  {
    label: "Avg. Rating",
    value: "4.8",
    stars: true,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function MenuEditor({
  menuItemsData = [],
  categoriesData = [],
}: {
  menuItemsData?: any[];
  categoriesData?: any[];
}) {
  const router = useRouter();

  const [menuItems, setMenuItems] = useState(menuItemsData);
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    setMenuItems(menuItemsData);
  }, [menuItemsData]);

  const refreshData = () => {
    router.refresh();
  };

  const handleEdit = (item: Menu) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item: Menu) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen ">
      <CreateMenuItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshData}
      />
      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        onSuccess={refreshData}
      />
      <EditMenuItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={refreshData}
        item={selectedItem}
      />
      <DeleteMenuItemModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={refreshData}
        item={selectedItem}
      />

      {/* ── Content ── */}
      <div className="px-6 pt-10 pb-24 max-w-7xl mx-auto">
        {/* ── Dashboard Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[#F27121] font-bold text-[10px] tracking-[0.22em] uppercase mb-2 block">
              Management
            </span>
            <h2 className="text-4xl font-black text-[#1C1B1B] tracking-tight leading-none mb-3">
              Menu Editor
            </h2>
            <p className="text-[#5c5b5b] max-w-md font-medium text-sm leading-relaxed">
              Curate your seasonal offerings, adjust pricing, and maintain the
              culinary excellence of Berlin Food.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Search dish…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-10 pe-4 py-3 bg-white border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F27121]/20 w-56 shadow-sm transition-all"
              />
              <Search
                size={16}
                className="absolute start-3 top-1/2 -translate-y-1/2 text-[#afacac] group-focus-within:text-[#F27121] transition-colors"
              />
            </div>

            {/* Add New */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#F27121] text-white px-5 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-[#F27121]/20 hover:scale-[1.02] active:scale-95 transition-all text-sm">
              <Plus size={16} strokeWidth={2.5} />
              Add New
            </button>
          </div>
        </div>

        {/* ── Stats Bento ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#1C1B1B]/5 flex flex-col justify-between h-32">
              <span className="text-[#5c5b5b] text-[10px] font-bold uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="flex items-end justify-between gap-2">
                <span className="text-2xl font-black text-[#1C1B1B] leading-none">
                  {stat.value}
                </span>
                {stat.badge && (
                  <span className="bg-[#F27121]/10 text-[#F27121] text-[10px] font-black px-2 py-1 rounded-full whitespace-nowrap">
                    {stat.badge}
                  </span>
                )}
                {stat.icon && stat.icon}
                {stat.stars && (
                  <div className="flex text-yellow-500">
                    {[0, 1, 2].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        fill="currentColor"
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Filter Bar ── */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {[{ id: "all", name: "All Items" }, ...categoriesData].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-[#F27121] text-white shadow-md shadow-[#F27121]/20"
                  : "bg-white text-[#5c5b5b] hover:text-[#1C1B1B] border border-transparent hover:border-[#F27121]/20 shadow-sm"
              }`}>
              {cat.name}
            </button>
          ))}

          <button
            onClick={() => {
              setIsCreateCategoryModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap bg-white text-[#F27121] border border-dashed border-[#F27121] hover:bg-[#F27121]/5 shadow-sm">
            <FolderPlus size={16} />
            Add Category
          </button>

          {/* View toggle */}
          <div className="ms-auto flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg shadow-sm transition-colors ${viewMode === "grid" ? "text-[#F27121] bg-white" : "text-[#afacac] bg-white hover:text-[#1C1B1B]"}`}>
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg shadow-sm transition-colors ${viewMode === "list" ? "text-[#F27121] bg-white" : "text-[#afacac] bg-white hover:text-[#1C1B1B]"}`}>
              <List size={18} />
            </button>
          </div>
        </div>

        {/* ── Menu Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeCategory === "all"
            ? menuItems
            : menuItems.filter((i) => i.category_id === activeCategory)
          ).map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item)}
            />
          ))}

          {/* Add New Card */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="group border-2 border-dashed border-stone-300 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center hover:border-[#F27121] hover:bg-white transition-all duration-300 min-h-[380px]">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#afacac] group-hover:bg-[#F27121] group-hover:text-white transition-all mb-4 shadow-sm">
              <PlusCircle size={28} />
            </div>
            <span className="text-base font-bold text-[#1C1B1B]">
              Add New Recipe
            </span>
            <p className="text-sm text-[#5c5b5b] mt-2 max-w-[180px] font-medium leading-relaxed">
              Expand your culinary collection with a new seasonal masterpiece.
            </p>
          </button>
        </div>

        {/* ── Inventory Table ── */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-[#1C1B1B] tracking-tight">
                Inventory Management
              </h3>
              <p className="text-[10px] text-[#5c5b5b] font-bold uppercase tracking-widest mt-1">
                Real-time supply &amp; demand
              </p>
            </div>
            <button className="flex items-center gap-2 text-[#F27121] text-sm font-bold px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all">
              Export PDF
              <Download size={14} />
            </button>
          </div>

          <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#1C1B1B]/5">
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr className="bg-stone-50/50 border-b border-[#1C1B1B]/5">
                    {[
                      "Item Name",
                      "Category",
                      "Price",
                      "Orders",
                      "Status",
                      "",
                    ].map((col, i) => (
                      <th
                        key={i}
                        className={`px-6 py-5 text-[10px] font-bold text-[#5c5b5b] uppercase tracking-[0.2em] ${i === 5 ? "text-end" : ""}`}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1B1B]/5">
                  {INVENTORY.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-[#F27121]/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-Image-element */}
                            <Image
                              src={row.image}
                              alt={row.name}
                              unoptimized
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-bold text-sm text-[#1C1B1B]">
                            {row.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#5c5b5b] font-medium">
                        {row.category}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#1C1B1B]">
                        ${row.price}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#5c5b5b] font-medium">
                        {row.orders}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-50 text-green-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-green-100">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-end">
                        <button className="text-[#afacac] hover:text-[#F27121] transition-colors p-1">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile FAB ── */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 end-6 w-14 h-14 bg-[#F27121] text-white rounded-full shadow-2xl shadow-[#F27121]/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 md:hidden">
        <Plus size={24} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ─── Menu Card ────────────────────────────────────────────────────────────────

function MenuCard({
  item,
  onEdit,
  onDelete,
}: {
  item: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`group bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.07)] transition-all duration-500 border border-transparent hover:border-[#F27121]/10 flex flex-col ${
        item.is_available === false ? "opacity-75" : ""
      }`}>
      {/* Image */}
      <div
        className={`relative h-52 p-4 ${item.is_available === false ? "grayscale-[20%]" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-Image-element */}
        <Image
          src={item.image_url || "https://placehold.co/600x400"}
          alt={item.name}
          unoptimized
          width={40}
          height={40}
          className="w-full h-full object-cover rounded-[2rem] shadow-md transition-transform duration-700 group-hover:scale-105"
        />
        {item.badge && (
          <span
            className={`absolute top-6 end-6 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${
              item.badge.dark
                ? "bg-[#1C1B1B]/95 text-white"
                : "bg-white/95 backdrop-blur text-[#F27121]"
            }`}>
            {item.badge.label}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-7 pb-7 pt-2 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2 gap-3">
          <h3 className="text-lg font-bold text-[#1C1B1B] group-hover:text-[#F27121] transition-colors leading-snug">
            {item.name}
          </h3>
          <span className="text-lg font-black text-[#F27121] flex-shrink-0">
            ${item.price}
          </span>
        </div>

        <p className="text-sm text-[#5c5b5b] line-clamp-2 mb-6 font-medium leading-relaxed">
          {item.description}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#1C1B1B]/5">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${item.is_available ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className="text-[10px] font-bold text-[#5c5b5b] uppercase tracking-widest">
              {item.is_available ? "In Stock" : "Sold Out"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              className="p-2 text-[#5c5b5b] hover:text-[#F27121] hover:bg-[#F27121]/5 rounded-full transition-all">
              <Edit2 size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-[#5c5b5b] hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
