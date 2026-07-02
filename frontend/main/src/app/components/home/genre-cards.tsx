"use client"

import { motion } from "framer-motion";

const hexagonVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

const cards = [
  { id: 1, img: "/Survival.jpg", text: "Card One" },
  { id: 2, img: "/Survival.jpg", text: "Card Two" },
  { id: 3, img: "/Survival.jpg", text: "Card Three" },
  { id: 4, img: "/Survival.jpg", text: "Card Four" },
  { id: 5, img: "/Survival.jpg", text: "Card Five" },
  { id: 6, img: "/Survival.jpg", text: "Card sixs" },  
];

export function HexSection() {
  return (
    <aside className="py-[4vh] flex items-center justify-center bg-black">
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            className="flex flex-col items-center"
            variants={hexagonVariants}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6, delay: i * 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.1 }}
          >
            <div
              className="w-24 h-24 bg-cover bg-center border-2 border-white shadow-lg"
              style={{
                backgroundImage: `url(${card.img})`,
                clipPath:
                  "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
              }}
            ></div>
            <p className="mt-2 text-white font-semibold">{card.text}</p>
          </motion.div>
        ))}
      </div>
    </aside>
  );
}
