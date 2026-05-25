import { Metadata } from "next";
import StoreAssetStudioContent from "./store-asset-studio-content";

export const metadata: Metadata = {
  title: "Store Asset Studio — Shiftlyx",
  description: "Generate App Store and Google Play screenshots with ASO-optimized layouts, correct sizing, and marketing copy.",
};

export default function StoreAssetStudioPage() {
  return <StoreAssetStudioContent />;
}
