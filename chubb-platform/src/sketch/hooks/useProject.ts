import { useCallback, useEffect, useState } from "react";
import { Equipment, EquipmentType, FloorPlan, Project, CartoucheData } from "../types/types";
import { pdfToImages } from "../utils/pdfUtils";

// ✅ Nommage d'étage identique
function getFloorName(index: number) {
  if (index === 0) return "Rez-de-chaussée";
  if (index === 1) return "1er étage";
  return `${index}e étage`;
}

export function useProject() {
  const [project, setProject] = useState<Project>({
    id: Date.now().toString(),
    name: "Nouveau Projet",
    building: "",
    floor: "",
    date: new Date().toISOString().split("T")[0],
    backgroundImage: null,
    equipment: [],
    scale: 1,
    context: "",
    sector: "tertiaire",
    floors: [
      {
        id: "RDC",
        name: getFloorName(0),
        backgroundImage: null,
        equipment: [],
        backgroundSize: { width: 0, height: 0 },
        backgroundOffset: { x: 0, y: 0 },
      },
    ],
    cartouche: {
      project: "",
      phase: "",
      revision: "A",
      date: new Date().toLocaleDateString("fr-FR"),
      modification: "CREATION",
      drawer: "",
      verifier: "",
      approver: "",
      projetNum: "",
      daoNum: "",
      scale: "S-0",
      folio: "",
      address: "",
    },
  });

  const [selectedTool, setSelectedTool] = useState<EquipmentType | null>(null);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [comfortScale, setComfortScale] = useState(1);

  // Pour PDF multipage (optionnel, on garde comme dans ton App)
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  // ✅ Gestion clavier slider échelle (← →)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setComfortScale((s) => Math.max(0, s - 0.05));
      if (e.key === "ArrowRight") setComfortScale((s) => Math.min(2, s + 0.05));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // ✅ Sync jauge pour export
  useEffect(() => {
    setProject((prev) => ({ ...prev, comfortScale }));
  }, [comfortScale]);

  // ✅ Mise à jour infos projet
  const handleProjectInfoChange = useCallback(
    (field: keyof Project, value: string) => {
      setProject((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // ✅ Mise à jour cartouche
  const handleUpdateCartouche = useCallback((updates: Partial<CartoucheData>) => {
    setProject((prev) => ({ ...prev, cartouche: { ...prev.cartouche, ...updates } }));
  }, []);

  // ✅ Import fichier (image ou PDF)
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file) return;

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            setProject((prev) => {
              const updatedFloors = [...prev.floors];
              updatedFloors[currentFloor] = {
                ...updatedFloors[currentFloor],
                backgroundImage: e.target?.result as string,
                backgroundSize: { width: img.width, height: img.height },
                backgroundOffset: { x: 0, y: 0 },
              };
              return { ...prev, floors: updatedFloors };
            });
            setPdfPages([]);
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        const pages = await pdfToImages(file);
        setPdfPages(pages);
        setCurrentPage(0);
        const firstPage = new Image();
        firstPage.onload = () => {
          setProject((prev) => {
            const updatedFloors = [...prev.floors];
            updatedFloors[currentFloor] = {
              ...updatedFloors[currentFloor],
              backgroundImage: pages[0],
              backgroundSize: { width: firstPage.width, height: firstPage.height },
              backgroundOffset: { x: 0, y: 0 },
            };
            return { ...prev, floors: updatedFloors };
          });
        };
        firstPage.src = pages[0];
      }
    },
    [currentFloor]
  );

  // ✅ CRUD équipements
  const handleAddEquipment = useCallback(
    (equipment: Equipment) => {
      setProject((prev) => {
        const updatedFloors = [...prev.floors];
        updatedFloors[currentFloor] = {
          ...updatedFloors[currentFloor],
          equipment: [...updatedFloors[currentFloor].equipment, equipment],
        };
        return { ...prev, floors: updatedFloors };
      });
    },
    [currentFloor]
  );

  const handleRemoveEquipment = useCallback(
    (id: string) => {
      setProject((prev) => {
        const updatedFloors = [...prev.floors];
        updatedFloors[currentFloor] = {
          ...updatedFloors[currentFloor],
          equipment: updatedFloors[currentFloor].equipment.filter((eq) => eq.id !== id),
        };
        return { ...prev, floors: updatedFloors };
      });
    },
    [currentFloor]
  );

  const handleUpdateEquipment = useCallback(
    (id: string, updates: Partial<Equipment>) => {
      setProject((prev) => {
        const updatedFloors = [...prev.floors];
        updatedFloors[currentFloor] = {
          ...updatedFloors[currentFloor],
          equipment: updatedFloors[currentFloor].equipment.map((eq) =>
            eq.id === id ? { ...eq, ...(updates as any) } : eq
          ),
        };
        return { ...prev, floors: updatedFloors };
      });
    },
    [currentFloor]
  );

  const handleRotateEquipment = useCallback(
    (id: string, angle: number) => {
      setProject((prev) => {
        const updatedFloors = [...prev.floors];
        updatedFloors[currentFloor] = {
          ...updatedFloors[currentFloor],
          equipment: updatedFloors[currentFloor].equipment.map((eq) =>
            eq.id === id ? { ...eq, rotation: angle } : eq
          ),
        };
        return { ...prev, floors: updatedFloors };
      });
    },
    [currentFloor]
  );

  const handleMoveEquipment = useCallback(
    (id: string, x: number, y: number) => {
      setProject((prev) => {
        const updatedFloors = [...prev.floors];
        updatedFloors[currentFloor] = {
          ...updatedFloors[currentFloor],
          equipment: updatedFloors[currentFloor].equipment.map((eq) =>
            eq.id === id ? { ...eq, x, y } : eq
          ),
        };
        return { ...prev, floors: updatedFloors };
      });
    },
    [currentFloor]
  );

  // ✅ Étages
  const handleAddFloor = useCallback(() => {
    setProject((prev) => {
      const newIndex = prev.floors.length;
      return {
        ...prev,
        floors: [
          ...prev.floors,
          {
            id: `floor-${Date.now()}`,
            name: getFloorName(newIndex),
            backgroundImage: null,
            equipment: [],
            backgroundSize: { width: 0, height: 0 },
            backgroundOffset: { x: 0, y: 0 },
          } as FloorPlan,
        ],
      };
    });
  }, []);

  const handleDeleteFloor = useCallback(() => {
    setProject((prev) => {
      if (prev.floors.length <= 1) {
        alert("Impossible de supprimer : il doit rester au moins un étage.");
        return prev;
      }
      const updatedFloors = prev.floors
        .filter((_, idx) => idx !== currentFloor)
        .map((f, i) => ({ ...f, name: getFloorName(i) }));
      return { ...prev, floors: updatedFloors };
    });
    // décale l'index courant après suppression
    setCurrentFloor((prev) => Math.max(0, prev - 1));
  }, [currentFloor]);

  // ✅ Calibration
  const handleCalibrationComplete = useCallback((newScale: number) => {
    setProject((prev) => ({ ...prev, scale: newScale }));
    alert("✅ Plan calibré !");
  }, []);

  return {
    // state
    project,
    setProject,
    selectedTool,
    setSelectedTool,
    currentFloor,
    setCurrentFloor,
    comfortScale,
    setComfortScale,
    pdfPages,
    currentPage,
    setCurrentPage,

    // handlers
    handleProjectInfoChange,
    handleUpdateCartouche,
    handleFileUpload,
    handleAddEquipment,
    handleRemoveEquipment,
    handleUpdateEquipment,
    handleRotateEquipment,
    handleMoveEquipment,
    handleAddFloor,
    handleDeleteFloor,
    handleCalibrationComplete,
  };
}
export default useProject;
