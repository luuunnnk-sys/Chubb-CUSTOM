// src/utils/export/summaryTable.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Project } from "../../types/types";
import { getEquipmentDefinitions } from "../equipmentDefinitions";

/**
 * Ajoute la page "Quantitatif Global par étage" au PDF en cours.
 * Export nommé requis par index.ts
 */
export function renderGlobalQuantitiesTable(pdf: jsPDF, project: Project): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 10;

  // Titre
  pdf.addPage();
  pdf.setFontSize(16).setFont("helvetica", "bold");
  pdf.setTextColor(0, 82, 155);
  pdf.text("Quantitatif Global par étage", pageWidth / 2, margin + 15, { align: "center" });
  pdf.setTextColor(0, 0, 0);

  const defs = getEquipmentDefinitions().filter((d) => d.type !== "note");
  const head = ["Étage", ...defs.map((d) => d.symbol ?? d.name), "TOTAL"];

  const floors = (project.floors || []).filter((f: any) => !f?.deleted);

  const body = floors.map((floor) => {
    const row: string[] = [floor.name];
    defs.forEach((def) => {
      const count = (floor.equipment || []).filter((eq: any) => eq.type === def.type).length;
      row.push(String(count));
    });
    const totalNoNotes = (floor.equipment || []).filter((eq: any) => eq.type !== "note").length;
    row.push(String(totalNoNotes));
    return row;
  });

  const totalRow: string[] = ["TOTAL"];
  defs.forEach((def) => {
    const total = floors.reduce(
      (sum, f) => sum + (f.equipment || []).filter((eq: any) => eq.type === def.type).length,
      0
    );
    totalRow.push(String(total));
  });
  const grandTotal = floors.reduce(
    (sum, f) => sum + (f.equipment || []).filter((eq: any) => eq.type !== "note").length,
    0
  );
  totalRow.push(String(grandTotal));
  body.push(totalRow);

  autoTable(pdf, {
    head: [head],
    body,
    startY: margin + 25,
    margin: { left: 20, right: 20 },
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 10,
      halign: "center",
      valign: "middle",
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [0, 82, 155],
      textColor: [255, 255, 255],
      fontSize: 11,
    },
    bodyStyles: { fillColor: [245, 247, 250] },
    alternateRowStyles: { fillColor: [255, 255, 255] },
    tableLineColor: [200, 200, 200],
    tableLineWidth: 0.3,
  });
}
