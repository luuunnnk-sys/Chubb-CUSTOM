import * as pdfjsLib from "pdfjs-dist";

// ✅ indiquer à pdfjs-dist où trouver son worker
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Convertit chaque page PDF en DataURL (image)
export async function pdfToImages(file: File): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const images: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport,
      canvas,
    }).promise;

    images.push(canvas.toDataURL("image/png"));
  }
  return images;
}
