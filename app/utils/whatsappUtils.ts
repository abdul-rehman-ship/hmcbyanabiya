export const generateWhatsAppMessage = (product: {
  name: string;
  price: number;
  size: string;
  description: string;
}): string => {
  const message = `Hello! I want to order this cake:\n\n` +
    `🍰 *${product.name}*\n` +
    `💰 Price: pkr ${product.price}\n` +
    `📏 Size: ${product.size}\n` +
    `📝 Description: ${product.description}\n\n` +
    `Please let me know about availability and delivery options.`;
  
  return encodeURIComponent(message);
};

export const openWhatsAppOrder = (product: {
  name: string;
  price: number;
  size: string;
  description: string;
}) => {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  const message = generateWhatsAppMessage(product);
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, '_blank');
};
