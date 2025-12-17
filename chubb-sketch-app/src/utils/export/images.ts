// src/utils/export/images.ts
export const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image(); img.onload = () => res(img); img.onerror = rej; img.src = src;
  });

export const fetchAsDataURL = async (url: string) => {
  const blob = await fetch(url).then(r => r.blob());
  return await new Promise<string>((ok) => {
    const fr = new FileReader(); fr.onload = () => ok(fr.result as string); fr.readAsDataURL(blob);
  });
};
