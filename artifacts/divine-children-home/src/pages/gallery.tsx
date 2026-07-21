import { PageHeader } from "@/components/page-header";
import { useListGalleryImages } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePageMeta } from "@/hooks/usePageMeta";
import { pageMeta } from "@/config/page-meta";

export default function Gallery() {
  const { data: images, isLoading } = useListGalleryImages();
  const [filter, setFilter] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  usePageMeta(pageMeta.gallery.title, pageMeta.gallery.description);

  const categories = ["All", ...Array.from(new Set((images || []).map(img => img.category)))];

  const filteredImages = filter === "All" 
    ? images 
    : images?.filter(img => img.category === filter);

  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Image Gallery"
        description="A glimpse into the warm, carefully designed environments we provide for our young people."
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <div className="container mx-auto px-4 py-20">
        
        {/* Filters */}
        {!isLoading && categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(cat => (
              <Button 
                key={cat} 
                variant={filter === cat ? "default" : "outline"}
                className={filter === cat ? "bg-primary text-white" : ""}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
            ))}
          </div>
        ) : !filteredImages || filteredImages.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No images found.
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredImages.map(img => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative cursor-pointer overflow-hidden rounded-xl aspect-[4/3] bg-muted shadow-sm"
                  onClick={() => setSelectedImage(img.imageUrl)}
                >
                  <img 
                    src={img.imageUrl} 
                    alt={img.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                    <h3 className="font-bold text-lg">{img.title}</h3>
                    <p className="text-sm text-white/80">{img.category}</p>
                    {img.caption && <p className="text-xs text-white/60 mt-2 line-clamp-2">{img.caption}</p>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-transparent border-none shadow-none">
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Gallery fullscreen" 
              className="w-full h-full object-contain max-h-[90vh] rounded-md"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}