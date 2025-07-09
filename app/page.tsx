import PhotoGridApp from "@/components/PhotoGridApp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Grid Report Builder | SimPRO CRM",
  description:
    "Generate professional photo reports from SimPRO jobs or uploaded images",
};

export default function HomePage() {
  return <PhotoGridApp />;
}

// "use client";

// import React, { useCallback, useMemo } from "react";
// import { useState } from "react";
// import {
//   Plus,
//   Trash2,
//   Calculator,
//   FileText,
//   Save,
//   Download,
//   Settings,
//   Clock,
//   Wrench,
//   Building,
// } from "lucide-react";

// interface ProjectDetails {
//   projectName: string;
//   projectNumber: string;
//   address: string;
//   customer: string;
//   contact: string;
//   location: string;
// }

// interface MeasureItem {
//   id: string;
//   location: "Internal" | "External";
//   level: string;
//   area1: number;
//   area2: number;
//   application: string;
//   product: string;
//   totalArea: number;
// }

// interface TakeOffItem {
//   id: string;
//   location: "Internal" | "External";
//   component: string;
//   substrate: string;
//   application: string;
//   product: string;
//   height: string;
//   measurements: { [key: string]: number };
//   totalQuantity: number;
// }

// interface AccessItem {
//   id: string;
//   location: "Internal" | "External";
//   component: string;
//   accessType: string;
//   equipment: string;
//   difficulty: "Low" | "Medium" | "High";
//   duration: number;
//   cost: number;
//   notes: string;
// }

// interface MaintenanceConfig {
//   laborRate: number;
//   margin: number;
//   washingRate: number;
//   yearlyRates: { [year: number]: number };
// }

// interface MaintenanceItem {
//   id: string;
//   location: "Internal" | "External";
//   component: string;
//   substrate: string;
//   application: string;
//   baseArea: number;
//   year1Cost: number;
//   year3Cost: number;
//   year5Cost: number;
//   year7Cost: number;
//   year10Cost: number;
//   totalMaintenanceCost: number;
// }

// interface HoursItem {
//   id: string;
//   location: "Internal" | "External";
//   component: string;
//   substrate: string;
//   application: string;
//   product: string;
//   area: number;
//   prepHours: number;
//   applicationHours: number;
//   totalHours: number;
//   hourlyRate: number;
//   totalCost: number;
// }

// interface EstimateItem {
//   id: string;
//   description: string;
//   quantity: number;
//   unit: string;
//   materialCost: number;
//   laborHours: number;
//   laborRate: number;
//   accessCost: number;
//   totalCost: number;
//   margin: number;
// }

// const COMPONENTS = [
//   "Ceiling",
//   "Wall",
//   "Door",
//   "Window",
//   "Trim",
//   "Floor",
//   "Exterior Wall",
//   "Roof",
//   "Fascia",
//   "Gutter",
//   "Downpipe",
//   "Balustrade",
//   "Column",
//   "Beam",
// ];

// const SUBSTRATES = [
//   "Concrete",
//   "Plasterboard",
//   "MDF",
//   "Timber",
//   "Metal",
//   "Brick",
//   "Rendered",
//   "Fiber Cement",
//   "Steel",
//   "Aluminum",
//   "Weatherboard",
// ];

// const APPLICATIONS = [
//   "Brush & Rolled",
//   "Spray",
//   "Primer Only",
//   "Undercoat + Topcoat",
//   "Texture Coat",
//   "Sealer + Topcoat",
//   "Stain + Topcoat",
// ];

// const PRODUCTS = [
//   "Dulux Professional",
//   "Solarguard",
//   "Dulux Total Prep",
//   "Taubmans Endure",
//   "Wattyl Solagard",
//   "Haymes Ultra Premium",
//   "Dulux Weathershield",
//   "Berger Silk",
//   "Bristol Paint",
//   "Taubmans All Weather",
// ];

// const HEIGHT_CATEGORIES = [
//   "Ground Level",
//   "Off Ground",
//   "Ladder Height",
//   "Scaffold Required",
//   "EWP Required",
//   "Rope Access",
// ];

// const ACCESS_TYPES = [
//   "Standard Access",
//   "Scaffold",
//   "EWP/Scissor Lift",
//   "Boom Lift",
//   "Ladder Work",
//   "Rope Access",
//   "Confined Space",
//   "Working at Heights",
// ];

// const EQUIPMENT_OPTIONS = [
//   "None",
//   "Scaffold System",
//   "19ft Scissor Lift",
//   "32ft Boom Lift",
//   "Extension Ladder",
//   "Rope Access Kit",
//   "Confined Space Equipment",
// ];

// export default function CompletePaintingEstimator() {
//   const [activeTab, setActiveTab] = useState("project");

//   const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
//     projectName: "",
//     projectNumber: "",
//     address: "",
//     customer: "",
//     contact: "",
//     location: "QLD",
//   });

//   const [measureItems, setMeasureItems] = useState<MeasureItem[]>([]);
//   const [takeOffItems, setTakeOffItems] = useState<TakeOffItem[]>([]);
//   const [estimateItems, setEstimateItems] = useState<EstimateItem[]>([]);
//   const [accessItems, setAccessItems] = useState<AccessItem[]>([]);
//   const [maintenanceConfig, setMaintenanceConfig] = useState<MaintenanceConfig>(
//     {
//       laborRate: 30,
//       margin: 0.3,
//       washingRate: 5,
//       yearlyRates: { 1: 0.05, 3: 0.15, 5: 0.25, 7: 0.35, 10: 0.5 },
//     }
//   );
//   const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>(
//     []
//   );
//   const [hoursItems, setHoursItems] = useState<HoursItem[]>([]);

//   const addMeasureItem = useCallback(() => {
//     const newItem: MeasureItem = {
//       id: `measure-${Date.now()}`,
//       location: "Internal",
//       level: "",
//       area1: 0,
//       area2: 0,
//       application: "",
//       product: "",
//       totalArea: 0,
//     };
//     setMeasureItems((prev) => [...prev, newItem]);
//   }, []);

//   const addTakeOffItem = useCallback(() => {
//     const newItem: TakeOffItem = {
//       id: `takeoff-${Date.now()}`,
//       location: "Internal",
//       component: "",
//       substrate: "",
//       application: "",
//       product: "",
//       height: "",
//       measurements: {},
//       totalQuantity: 0,
//     };
//     setTakeOffItems((prev) => [...prev, newItem]);
//   }, []);

//   const addAccessItem = useCallback(() => {
//     const newItem: AccessItem = {
//       id: `access-${Date.now()}`,
//       location: "Internal",
//       component: "",
//       accessType: "",
//       equipment: "",
//       difficulty: "Low",
//       duration: 0,
//       cost: 0,
//       notes: "",
//     };
//     setAccessItems((prev) => [...prev, newItem]);
//   }, []);

//   const addMaintenanceItem = useCallback(() => {
//     const newItem: MaintenanceItem = {
//       id: `maintenance-${Date.now()}`,
//       location: "Internal",
//       component: "",
//       substrate: "",
//       application: "",
//       baseArea: 0,
//       year1Cost: 0,
//       year3Cost: 0,
//       year5Cost: 0,
//       year7Cost: 0,
//       year10Cost: 0,
//       totalMaintenanceCost: 0,
//     };
//     setMaintenanceItems((prev) => [...prev, newItem]);
//   }, []);

//   const addHoursItem = useCallback(() => {
//     const newItem: HoursItem = {
//       id: `hours-${Date.now()}`,
//       location: "Internal",
//       component: "",
//       substrate: "",
//       application: "",
//       product: "",
//       area: 0,
//       prepHours: 0,
//       applicationHours: 0,
//       totalHours: 0,
//       hourlyRate: 65,
//       totalCost: 0,
//     };
//     setHoursItems((prev) => [...prev, newItem]);
//   }, []);

//   const addEstimateItem = useCallback(() => {
//     const newItem: EstimateItem = {
//       id: `estimate-${Date.now()}`,
//       description: "",
//       quantity: 0,
//       unit: "sqm",
//       materialCost: 0,
//       laborHours: 0,
//       laborRate: 65,
//       accessCost: 0,
//       totalCost: 0,
//       margin: 30,
//     };
//     setEstimateItems((prev) => [...prev, newItem]);
//   }, []);

//   const updateMeasureItem = useCallback(
//     (id: string, field: keyof MeasureItem, value: any) => {
//       setMeasureItems((prev) =>
//         prev.map((item) => {
//           if (item.id === id) {
//             const updated = { ...item, [field]: value };
//             if (field === "area1" || field === "area2") {
//               updated.totalArea = updated.area1 * updated.area2;
//             }
//             return updated;
//           }
//           return item;
//         })
//       );
//     },
//     []
//   );

//   const updateTakeOffItem = useCallback(
//     (id: string, field: string, value: any) => {
//       setTakeOffItems((prev) =>
//         prev.map((item) => {
//           if (item.id === id) {
//             const updated = { ...item, [field]: value };
//             if (field.startsWith("measurements.")) {
//               const measurementKey = field.split(".")[1];
//               updated.measurements[measurementKey] = value;
//               updated.totalQuantity = Object.values(
//                 updated.measurements
//               ).reduce((sum: number, val: number) => sum + (val || 0), 0);
//             }
//             return updated;
//           }
//           return item;
//         })
//       );
//     },
//     []
//   );

//   const updateAccessItem = useCallback(
//     (id: string, field: keyof AccessItem, value: any) => {
//       setAccessItems((prev) =>
//         prev.map((item) => {
//           if (item.id === id) {
//             const updated = { ...item, [field]: value };
//             if (field === "difficulty" || field === "duration") {
//               const multiplier =
//                 updated.difficulty === "High"
//                   ? 1.5
//                   : updated.difficulty === "Medium"
//                   ? 1.2
//                   : 1;
//               updated.cost = updated.duration * 150 * multiplier;
//             }
//             return updated;
//           }
//           return item;
//         })
//       );
//     },
//     []
//   );

//   const updateMaintenanceItem = useCallback(
//     (id: string, field: keyof MaintenanceItem, value: any) => {
//       setMaintenanceItems((prev) =>
//         prev.map((item) => {
//           if (item.id === id) {
//             const updated = { ...item, [field]: value };
//             if (field === "baseArea") {
//               updated.year1Cost =
//                 updated.baseArea *
//                 maintenanceConfig.yearlyRates[1] *
//                 maintenanceConfig.laborRate;
//               updated.year3Cost =
//                 updated.baseArea *
//                 maintenanceConfig.yearlyRates[3] *
//                 maintenanceConfig.laborRate;
//               updated.year5Cost =
//                 updated.baseArea *
//                 maintenanceConfig.yearlyRates[5] *
//                 maintenanceConfig.laborRate;
//               updated.year7Cost =
//                 updated.baseArea *
//                 maintenanceConfig.yearlyRates[7] *
//                 maintenanceConfig.laborRate;
//               updated.year10Cost =
//                 updated.baseArea *
//                 maintenanceConfig.yearlyRates[10] *
//                 maintenanceConfig.laborRate;
//               updated.totalMaintenanceCost =
//                 updated.year1Cost +
//                 updated.year3Cost +
//                 updated.year5Cost +
//                 updated.year7Cost +
//                 updated.year10Cost;
//             }
//             return updated;
//           }
//           return item;
//         })
//       );
//     },
//     [maintenanceConfig]
//   );

//   const updateHoursItem = useCallback(
//     (id: string, field: keyof HoursItem, value: any) => {
//       setHoursItems((prev) =>
//         prev.map((item) => {
//           if (item.id === id) {
//             const updated = { ...item, [field]: value };
//             if (field === "area" || field === "application") {
//               const prepRate = updated.application === "Spray" ? 0.05 : 0.08;
//               const applicationRate =
//                 updated.application === "Spray" ? 0.08 : 0.12;
//               updated.prepHours = updated.area * prepRate;
//               updated.applicationHours = updated.area * applicationRate;
//               updated.totalHours = updated.prepHours + updated.applicationHours;
//               updated.totalCost = updated.totalHours * updated.hourlyRate;
//             }
//             if (field === "hourlyRate") {
//               updated.totalCost = updated.totalHours * updated.hourlyRate;
//             }
//             return updated;
//           }
//           return item;
//         })
//       );
//     },
//     []
//   );

//   const updateEstimateItem = useCallback(
//     (id: string, field: keyof EstimateItem, value: any) => {
//       setEstimateItems((prev) =>
//         prev.map((item) => {
//           if (item.id === id) {
//             const updated = { ...item, [field]: value };
//             if (
//               field === "quantity" ||
//               field === "materialCost" ||
//               field === "laborHours" ||
//               field === "laborRate" ||
//               field === "accessCost" ||
//               field === "margin"
//             ) {
//               const baseCost =
//                 updated.materialCost +
//                 updated.laborHours * updated.laborRate +
//                 updated.accessCost;
//               updated.totalCost = baseCost * (1 + updated.margin / 100);
//             }
//             return updated;
//           }
//           return item;
//         })
//       );
//     },
//     []
//   );

//   const generateComprehensiveEstimate = useCallback(() => {
//     const newEstimateItems: EstimateItem[] = [];

//     takeOffItems.forEach((takeOff) => {
//       const laborHoursPerSqm = takeOff.application === "Spray" ? 0.12 : 0.18;
//       const materialCostPerSqm = 8.5;
//       const laborRate = 65;

//       const quantity = takeOff.totalQuantity;
//       const materialCost = quantity * materialCostPerSqm;
//       const laborHours = quantity * laborHoursPerSqm;

//       const relatedAccess = accessItems.filter(
//         (access) =>
//           access.component === takeOff.component &&
//           access.location === takeOff.location
//       );
//       const accessCost = relatedAccess.reduce(
//         (sum, access) => sum + access.cost,
//         0
//       );

//       const baseCost = materialCost + laborHours * laborRate + accessCost;
//       const totalCost = baseCost * 1.3;

//       newEstimateItems.push({
//         id: `estimate-${takeOff.id}`,
//         description: `${takeOff.location} ${takeOff.component} - ${takeOff.substrate} (${takeOff.application})`,
//         quantity,
//         unit: "sqm",
//         materialCost,
//         laborHours,
//         laborRate,
//         accessCost,
//         totalCost,
//         margin: 30,
//       });
//     });

//     setEstimateItems(newEstimateItems);
//     setActiveTab("estimate");
//   }, [takeOffItems, accessItems]);

//   const totals = useMemo(() => {
//     const totalArea = takeOffItems.reduce(
//       (sum, item) => sum + item.totalQuantity,
//       0
//     );
//     const totalMaterialCost = estimateItems.reduce(
//       (sum, item) => sum + item.materialCost,
//       0
//     );
//     const totalLaborHours = estimateItems.reduce(
//       (sum, item) => sum + item.laborHours,
//       0
//     );
//     const totalAccessCost = estimateItems.reduce(
//       (sum, item) => sum + item.accessCost,
//       0
//     );
//     const totalCost = estimateItems.reduce(
//       (sum, item) => sum + item.totalCost,
//       0
//     );
//     const totalMaintenanceCost = maintenanceItems.reduce(
//       (sum, item) => sum + item.totalMaintenanceCost,
//       0
//     );

//     return {
//       totalArea,
//       totalMaterialCost,
//       totalLaborHours,
//       totalAccessCost,
//       totalCost,
//       totalMaintenanceCost,
//     };
//   }, [estimateItems, takeOffItems, maintenanceItems]);

//   const tabs = [
//     { id: "project", label: "Project Details", icon: FileText },
//     { id: "measure", label: "Basic Measure", icon: Plus },
//     { id: "takeoff", label: "Take Off", icon: Calculator },
//     { id: "estimate", label: "Estimate", icon: Calculator },
//     { id: "access", label: "Access & Spec", icon: Building },
//     { id: "maintenance-config", label: "Maintenance Config", icon: Settings },
//     { id: "maintenance", label: "Maintenance Est.", icon: Wrench },
//     { id: "hours", label: "Hours by Measure", icon: Clock },
//   ];

//   const handleSave = () => {
//     const data = {
//       projectDetails,
//       measureItems,
//       takeOffItems,
//       estimateItems,
//       accessItems,
//       maintenanceConfig,
//       maintenanceItems,
//       hoursItems,
//     };
//     const blob = new Blob([JSON.stringify(data, null, 2)], {
//       type: "application/json",
//     });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${projectDetails.projectName || "estimate"}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const handleExport = () => {
//     const csvData = [
//       [
//         "Description",
//         "Quantity",
//         "Unit",
//         "Material Cost",
//         "Labor Hours",
//         "Access Cost",
//         "Total Cost",
//       ],
//       ...estimateItems.map((item) => [
//         item.description,
//         item.quantity.toFixed(2),
//         item.unit,
//         item.materialCost.toFixed(2),
//         item.laborHours.toFixed(1),
//         item.accessCost.toFixed(2),
//         item.totalCost.toFixed(2),
//       ]),
//     ];

//     const csvString = csvData.map((row) => row.join(",")).join("\n");
//     const blob = new Blob([csvString], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${projectDetails.projectName || "estimate"}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Rasvertex Professional Estimator
//               </h1>
//               <p className="text-gray-600 mt-1">
//                 Complete 8-sheet painting estimation system
//               </p>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={handleSave}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <Save size={20} />
//                 Save
//               </button>
//               <button
//                 onClick={handleExport}
//                 className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 <Download size={20} />
//                 Export
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="bg-white rounded-lg shadow-lg mb-6">
//           <div className="flex flex-wrap border-b">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors text-sm ${
//                   activeTab === tab.id
//                     ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
//                     : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//                 }`}
//               >
//                 <tab.icon size={16} />
//                 {tab.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           {/* Project Details Tab */}
//           {activeTab === "project" && (
//             <div className="space-y-6">
//               <h2 className="text-2xl font-bold text-gray-900">
//                 Project Details
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Project Name
//                   </label>
//                   <input
//                     type="text"
//                     value={projectDetails.projectName}
//                     onChange={(e) =>
//                       setProjectDetails((prev) => ({
//                         ...prev,
//                         projectName: e.target.value,
//                       }))
//                     }
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter project name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Project Number
//                   </label>
//                   <input
//                     type="text"
//                     value={projectDetails.projectNumber}
//                     onChange={(e) =>
//                       setProjectDetails((prev) => ({
//                         ...prev,
//                         projectNumber: e.target.value,
//                       }))
//                     }
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter project number"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Address
//                   </label>
//                   <input
//                     type="text"
//                     value={projectDetails.address}
//                     onChange={(e) =>
//                       setProjectDetails((prev) => ({
//                         ...prev,
//                         address: e.target.value,
//                       }))
//                     }
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter project address"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Customer
//                   </label>
//                   <input
//                     type="text"
//                     value={projectDetails.customer}
//                     onChange={(e) =>
//                       setProjectDetails((prev) => ({
//                         ...prev,
//                         customer: e.target.value,
//                       }))
//                     }
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter customer name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Contact
//                   </label>
//                   <input
//                     type="text"
//                     value={projectDetails.contact}
//                     onChange={(e) =>
//                       setProjectDetails((prev) => ({
//                         ...prev,
//                         contact: e.target.value,
//                       }))
//                     }
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter contact information"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Location
//                   </label>
//                   <select
//                     value={projectDetails.location}
//                     onChange={(e) =>
//                       setProjectDetails((prev) => ({
//                         ...prev,
//                         location: e.target.value,
//                       }))
//                     }
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="QLD">Queensland</option>
//                     <option value="NSW">New South Wales</option>
//                     <option value="VIC">Victoria</option>
//                     <option value="SA">South Australia</option>
//                     <option value="WA">Western Australia</option>
//                     <option value="TAS">Tasmania</option>
//                     <option value="ACT">ACT</option>
//                     <option value="NT">Northern Territory</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Basic Measure Tab */}
//           {activeTab === "measure" && (
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   Basic Measurements
//                 </h2>
//                 <button
//                   onClick={addMeasureItem}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   <Plus size={20} />
//                   Add Measurement
//                 </button>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse border border-gray-300">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="border border-gray-300 p-3 text-left">
//                         Location
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Level
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Length (m)
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Width (m)
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Application
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Product
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Total Area (m²)
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {measureItems.map((item) => (
//                       <tr key={item.id} className="hover:bg-gray-50">
//                         <td className="border border-gray-300 p-2">
//                           <select
//                             value={item.location}
//                             onChange={(e) =>
//                               updateMeasureItem(
//                                 item.id,
//                                 "location",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                           >
//                             <option value="Internal">Internal</option>
//                             <option value="External">External</option>
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <input
//                             type="text"
//                             value={item.level}
//                             onChange={(e) =>
//                               updateMeasureItem(
//                                 item.id,
//                                 "level",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                             placeholder="Level/Floor"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <input
//                             type="number"
//                             value={item.area1}
//                             onChange={(e) =>
//                               updateMeasureItem(
//                                 item.id,
//                                 "area1",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                             step="0.1"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <input
//                             type="number"
//                             value={item.area2}
//                             onChange={(e) =>
//                               updateMeasureItem(
//                                 item.id,
//                                 "area2",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                             step="0.1"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <select
//                             value={item.application}
//                             onChange={(e) =>
//                               updateMeasureItem(
//                                 item.id,
//                                 "application",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                           >
//                             <option value="">Select...</option>
//                             {APPLICATIONS.map((app) => (
//                               <option key={app} value={app}>
//                                 {app}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <select
//                             value={item.product}
//                             onChange={(e) =>
//                               updateMeasureItem(
//                                 item.id,
//                                 "product",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                           >
//                             <option value="">Select...</option>
//                             {PRODUCTS.map((prod) => (
//                               <option key={prod} value={prod}>
//                                 {prod}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-2 text-center font-medium">
//                           {item.totalArea.toFixed(2)}
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <button
//                             onClick={() =>
//                               setMeasureItems((prev) =>
//                                 prev.filter((i) => i.id !== item.id)
//                               )
//                             }
//                             className="p-2 text-red-600 hover:bg-red-50 rounded"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {measureItems.length === 0 && (
//                 <div className="text-center py-12 text-gray-500">
//                   <Plus size={48} className="mx-auto mb-4 opacity-50" />
//                   <p className="text-lg">No measurements added yet</p>
//                   <p>Click "Add Measurement" to get started</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Take Off Tab */}
//           {activeTab === "takeoff" && (
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   Detailed Take Off
//                 </h2>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={addTakeOffItem}
//                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                   >
//                     <Plus size={20} />
//                     Add Take Off Item
//                   </button>
//                   <button
//                     onClick={generateComprehensiveEstimate}
//                     className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//                   >
//                     <Calculator size={20} />
//                     Generate Estimate
//                   </button>
//                 </div>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse border border-gray-300 text-sm">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="border border-gray-300 p-2 text-left">
//                         Location
//                       </th>
//                       <th className="border border-gray-300 p-2 text-left">
//                         Component
//                       </th>
//                       <th className="border border-gray-300 p-2 text-left">
//                         Substrate
//                       </th>
//                       <th className="border border-gray-300 p-2 text-left">
//                         Application
//                       </th>
//                       <th className="border border-gray-300 p-2 text-left">
//                         Product
//                       </th>
//                       <th className="border border-gray-300 p-2 text-left">
//                         Height
//                       </th>
//                       <th className="border border-gray-300 p-2 text-left">
//                         Area 1
//                       </th>
//                       <th className="border border-gray-300 p-2 text-left">
//                         Area 2
//                       </th>
//                       <th className="border border-gray-300 p-2 text-left">
//                         Area 3
//                       </th>
//                       <th className="border border-gray-300 p-2 text-left">
//                         Area 4
//                       </th>
//                       <th className="border border-gray-300 p-2 text-left">
//                         Total Qty
//                       </th>
//                       <th className="border border-gray-300 p-2 text-left">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {takeOffItems.map((item) => (
//                       <tr key={item.id} className="hover:bg-gray-50">
//                         <td className="border border-gray-300 p-1">
//                           <select
//                             value={item.location}
//                             onChange={(e) =>
//                               updateTakeOffItem(
//                                 item.id,
//                                 "location",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-1 border border-gray-300 rounded text-sm"
//                           >
//                             <option value="Internal">Internal</option>
//                             <option value="External">External</option>
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-1">
//                           <select
//                             value={item.component}
//                             onChange={(e) =>
//                               updateTakeOffItem(
//                                 item.id,
//                                 "component",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-1 border border-gray-300 rounded text-sm"
//                           >
//                             <option value="">Select...</option>
//                             {COMPONENTS.map((comp) => (
//                               <option key={comp} value={comp}>
//                                 {comp}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-1">
//                           <select
//                             value={item.substrate}
//                             onChange={(e) =>
//                               updateTakeOffItem(
//                                 item.id,
//                                 "substrate",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-1 border border-gray-300 rounded text-sm"
//                           >
//                             <option value="">Select...</option>
//                             {SUBSTRATES.map((sub) => (
//                               <option key={sub} value={sub}>
//                                 {sub}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-1">
//                           <select
//                             value={item.application}
//                             onChange={(e) =>
//                               updateTakeOffItem(
//                                 item.id,
//                                 "application",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-1 border border-gray-300 rounded text-sm"
//                           >
//                             <option value="">Select...</option>
//                             {APPLICATIONS.map((app) => (
//                               <option key={app} value={app}>
//                                 {app}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-1">
//                           <select
//                             value={item.product}
//                             onChange={(e) =>
//                               updateTakeOffItem(
//                                 item.id,
//                                 "product",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-1 border border-gray-300 rounded text-sm"
//                           >
//                             <option value="">Select...</option>
//                             {PRODUCTS.map((prod) => (
//                               <option key={prod} value={prod}>
//                                 {prod}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-1">
//                           <select
//                             value={item.height}
//                             onChange={(e) =>
//                               updateTakeOffItem(
//                                 item.id,
//                                 "height",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-1 border border-gray-300 rounded text-sm"
//                           >
//                             <option value="">Select...</option>
//                             {HEIGHT_CATEGORIES.map((height) => (
//                               <option key={height} value={height}>
//                                 {height}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-1">
//                           <input
//                             type="number"
//                             value={item.measurements.area1 || 0}
//                             onChange={(e) =>
//                               updateTakeOffItem(
//                                 item.id,
//                                 "measurements.area1",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             className="w-20 p-1 border border-gray-300 rounded text-sm"
//                             step="0.1"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-1">
//                           <input
//                             type="number"
//                             value={item.measurements.area2 || 0}
//                             onChange={(e) =>
//                               updateTakeOffItem(
//                                 item.id,
//                                 "measurements.area2",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             className="w-20 p-1 border border-gray-300 rounded text-sm"
//                             step="0.1"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-1">
//                           <input
//                             type="number"
//                             value={item.measurements.area3 || 0}
//                             onChange={(e) =>
//                               updateTakeOffItem(
//                                 item.id,
//                                 "measurements.area3",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             className="w-20 p-1 border border-gray-300 rounded text-sm"
//                             step="0.1"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-1">
//                           <input
//                             type="number"
//                             value={item.measurements.area4 || 0}
//                             onChange={(e) =>
//                               updateTakeOffItem(
//                                 item.id,
//                                 "measurements.area4",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             className="w-20 p-1 border border-gray-300 rounded text-sm"
//                             step="0.1"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-1 text-center font-medium">
//                           {item.totalQuantity.toFixed(2)}
//                         </td>
//                         <td className="border border-gray-300 p-1">
//                           <button
//                             onClick={() =>
//                               setTakeOffItems((prev) =>
//                                 prev.filter((i) => i.id !== item.id)
//                               )
//                             }
//                             className="p-1 text-red-600 hover:bg-red-50 rounded"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {takeOffItems.length === 0 && (
//                 <div className="text-center py-12 text-gray-500">
//                   <Calculator size={48} className="mx-auto mb-4 opacity-50" />
//                   <p className="text-lg">No take-off items added yet</p>
//                   <p>Add items to start building your estimate</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Estimate Tab */}
//           {activeTab === "estimate" && (
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   Comprehensive Estimate
//                 </h2>
//                 <button
//                   onClick={addEstimateItem}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   <Plus size={20} />
//                   Add Manual Item
//                 </button>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse border border-gray-300">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="border border-gray-300 p-3 text-left">
//                         Description
//                       </th>
//                       <th className="border border-gray-300 p-3 text-right">
//                         Quantity
//                       </th>
//                       <th className="border border-gray-300 p-3 text-right">
//                         Unit
//                       </th>
//                       <th className="border border-gray-300 p-3 text-right">
//                         Material Cost
//                       </th>
//                       <th className="border border-gray-300 p-3 text-right">
//                         Labor Hours
//                       </th>
//                       <th className="border border-gray-300 p-3 text-right">
//                         Labor Rate
//                       </th>
//                       <th className="border border-gray-300 p-3 text-right">
//                         Access Cost
//                       </th>
//                       <th className="border border-gray-300 p-3 text-right">
//                         Margin %
//                       </th>
//                       <th className="border border-gray-300 p-3 text-right">
//                         Total Cost
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {estimateItems.map((item) => (
//                       <tr key={item.id} className="hover:bg-gray-50">
//                         <td className="border border-gray-300 p-3">
//                           <input
//                             type="text"
//                             value={item.description}
//                             onChange={(e) =>
//                               updateEstimateItem(
//                                 item.id,
//                                 "description",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                             placeholder="Description"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-3 text-right">
//                           <input
//                             type="number"
//                             value={item.quantity}
//                             onChange={(e) =>
//                               updateEstimateItem(
//                                 item.id,
//                                 "quantity",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             className="w-20 p-2 border border-gray-300 rounded text-right"
//                             step="0.1"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-3 text-right">
//                           <select
//                             value={item.unit}
//                             onChange={(e) =>
//                               updateEstimateItem(
//                                 item.id,
//                                 "unit",
//                                 e.target.value
//                               )
//                             }
//                             className="w-16 p-2 border border-gray-300 rounded"
//                           >
//                             <option value="sqm">sqm</option>
//                             <option value="lm">lm</option>
//                             <option value="ea">ea</option>
//                             <option value="hrs">hrs</option>
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-3 text-right">
//                           <input
//                             type="number"
//                             value={item.materialCost}
//                             onChange={(e) =>
//                               updateEstimateItem(
//                                 item.id,
//                                 "materialCost",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             className="w-24 p-2 border border-gray-300 rounded text-right"
//                             step="0.01"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-3 text-right">
//                           <input
//                             type="number"
//                             value={item.laborHours}
//                             onChange={(e) =>
//                               updateEstimateItem(
//                                 item.id,
//                                 "laborHours",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             className="w-20 p-2 border border-gray-300 rounded text-right"
//                             step="0.1"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-3 text-right">
//                           <input
//                             type="number"
//                             value={item.laborRate}
//                             onChange={(e) =>
//                               updateEstimateItem(
//                                 item.id,
//                                 "laborRate",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             className="w-20 p-2 border border-gray-300 rounded text-right"
//                             step="1"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-3 text-right">
//                           <input
//                             type="number"
//                             value={item.accessCost}
//                             onChange={(e) =>
//                               updateEstimateItem(
//                                 item.id,
//                                 "accessCost",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             className="w-24 p-2 border border-gray-300 rounded text-right"
//                             step="0.01"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-3 text-right">
//                           <input
//                             type="number"
//                             value={item.margin}
//                             onChange={(e) =>
//                               updateEstimateItem(
//                                 item.id,
//                                 "margin",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             className="w-16 p-2 border border-gray-300 rounded text-right"
//                             step="1"
//                             max="100"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-3 text-right font-medium">
//                           ${item.totalCost.toFixed(2)}
//                         </td>
//                         <td className="border border-gray-300 p-3">
//                           <button
//                             onClick={() =>
//                               setEstimateItems((prev) =>
//                                 prev.filter((i) => i.id !== item.id)
//                               )
//                             }
//                             className="p-2 text-red-600 hover:bg-red-50 rounded"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {estimateItems.length === 0 && (
//                 <div className="text-center py-12 text-gray-500">
//                   <Calculator size={48} className="mx-auto mb-4 opacity-50" />
//                   <p className="text-lg">No estimate generated yet</p>
//                   <p>
//                     Go to the Take Off tab and click "Generate Estimate" or add
//                     manual items
//                   </p>
//                 </div>
//               )}

//               {estimateItems.length > 0 && (
//                 <>
//                   {/* Summary Dashboard */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                       <h3 className="text-sm font-medium text-blue-900 mb-1">
//                         Total Area
//                       </h3>
//                       <p className="text-2xl font-bold text-blue-900">
//                         {totals.totalArea.toFixed(1)} m²
//                       </p>
//                     </div>
//                     <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                       <h3 className="text-sm font-medium text-green-900 mb-1">
//                         Material Cost
//                       </h3>
//                       <p className="text-2xl font-bold text-green-900">
//                         ${totals.totalMaterialCost.toFixed(0)}
//                       </p>
//                     </div>
//                     <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                       <h3 className="text-sm font-medium text-yellow-900 mb-1">
//                         Labor Hours
//                       </h3>
//                       <p className="text-2xl font-bold text-yellow-900">
//                         {totals.totalLaborHours.toFixed(1)}h
//                       </p>
//                     </div>
//                     <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
//                       <h3 className="text-sm font-medium text-orange-900 mb-1">
//                         Access Cost
//                       </h3>
//                       <p className="text-2xl font-bold text-orange-900">
//                         ${totals.totalAccessCost.toFixed(0)}
//                       </p>
//                     </div>
//                     <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
//                       <h3 className="text-sm font-medium text-purple-900 mb-1">
//                         Total Project Cost
//                       </h3>
//                       <p className="text-2xl font-bold text-purple-900">
//                         ${totals.totalCost.toFixed(0)}
//                       </p>
//                     </div>
//                     <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
//                       <h3 className="text-sm font-medium text-indigo-900 mb-1">
//                         10-Year Maintenance
//                       </h3>
//                       <p className="text-2xl font-bold text-indigo-900">
//                         ${totals.totalMaintenanceCost.toFixed(0)}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Three Quote Options */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
//                     <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
//                       <div className="text-center mb-4">
//                         <h3 className="text-lg font-bold text-gray-900">
//                           Basic Scope
//                         </h3>
//                         <p className="text-sm text-gray-600">
//                           Essential work only
//                         </p>
//                       </div>
//                       <div className="space-y-3">
//                         <div className="flex justify-between">
//                           <span>Project Cost:</span>
//                           <span className="font-medium">
//                             ${(totals.totalCost * 0.7).toFixed(0)}
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Timeline:</span>
//                           <span className="font-medium">
//                             {Math.ceil((totals.totalLaborHours * 0.7) / 40)}{" "}
//                             weeks
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Maintenance:</span>
//                           <span className="font-medium">
//                             ${(totals.totalMaintenanceCost * 0.8).toFixed(0)}
//                           </span>
//                         </div>
//                       </div>
//                       <button className="w-full mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
//                         Generate Basic Quote
//                       </button>
//                     </div>

//                     <div className="bg-white border-2 border-blue-500 rounded-lg p-6 relative">
//                       <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                         <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
//                           RECOMMENDED
//                         </span>
//                       </div>
//                       <div className="text-center mb-4">
//                         <h3 className="text-lg font-bold text-blue-900">
//                           Standard Scope
//                         </h3>
//                         <p className="text-sm text-blue-600">
//                           Complete professional job
//                         </p>
//                       </div>
//                       <div className="space-y-3">
//                         <div className="flex justify-between">
//                           <span>Project Cost:</span>
//                           <span className="font-medium">
//                             ${totals.totalCost.toFixed(0)}
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Timeline:</span>
//                           <span className="font-medium">
//                             {Math.ceil(totals.totalLaborHours / 40)} weeks
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Maintenance:</span>
//                           <span className="font-medium">
//                             ${totals.totalMaintenanceCost.toFixed(0)}
//                           </span>
//                         </div>
//                       </div>
//                       <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//                         Generate Standard Quote
//                       </button>
//                     </div>

//                     <div className="bg-white border-2 border-green-500 rounded-lg p-6">
//                       <div className="text-center mb-4">
//                         <h3 className="text-lg font-bold text-green-900">
//                           Premium Scope
//                         </h3>
//                         <p className="text-sm text-green-600">
//                           Premium finishes & warranty
//                         </p>
//                       </div>
//                       <div className="space-y-3">
//                         <div className="flex justify-between">
//                           <span>Project Cost:</span>
//                           <span className="font-medium">
//                             ${(totals.totalCost * 1.25).toFixed(0)}
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Timeline:</span>
//                           <span className="font-medium">
//                             {Math.ceil((totals.totalLaborHours * 1.1) / 40)}{" "}
//                             weeks
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Maintenance:</span>
//                           <span className="font-medium">
//                             ${(totals.totalMaintenanceCost * 0.6).toFixed(0)}
//                           </span>
//                         </div>
//                       </div>
//                       <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
//                         Generate Premium Quote
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* Access & Spec Tab */}
//           {activeTab === "access" && (
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   Access & Special Requirements
//                 </h2>
//                 <button
//                   onClick={addAccessItem}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   <Plus size={20} />
//                   Add Access Item
//                 </button>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse border border-gray-300">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="border border-gray-300 p-3 text-left">
//                         Location
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Component
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Access Type
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Equipment
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Difficulty
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Duration (hrs)
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Cost
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Notes
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {accessItems.map((item) => (
//                       <tr key={item.id} className="hover:bg-gray-50">
//                         <td className="border border-gray-300 p-2">
//                           <select
//                             value={item.location}
//                             onChange={(e) =>
//                               updateAccessItem(
//                                 item.id,
//                                 "location",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                           >
//                             <option value="Internal">Internal</option>
//                             <option value="External">External</option>
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <select
//                             value={item.component}
//                             onChange={(e) =>
//                               updateAccessItem(
//                                 item.id,
//                                 "component",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                           >
//                             <option value="">Select...</option>
//                             {COMPONENTS.map((comp) => (
//                               <option key={comp} value={comp}>
//                                 {comp}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <select
//                             value={item.accessType}
//                             onChange={(e) =>
//                               updateAccessItem(
//                                 item.id,
//                                 "accessType",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                           >
//                             <option value="">Select...</option>
//                             {ACCESS_TYPES.map((type) => (
//                               <option key={type} value={type}>
//                                 {type}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <select
//                             value={item.equipment}
//                             onChange={(e) =>
//                               updateAccessItem(
//                                 item.id,
//                                 "equipment",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                           >
//                             <option value="">Select...</option>
//                             {EQUIPMENT_OPTIONS.map((eq) => (
//                               <option key={eq} value={eq}>
//                                 {eq}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <select
//                             value={item.difficulty}
//                             onChange={(e) =>
//                               updateAccessItem(
//                                 item.id,
//                                 "difficulty",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                           >
//                             <option value="Low">Low</option>
//                             <option value="Medium">Medium</option>
//                             <option value="High">High</option>
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <input
//                             type="number"
//                             value={item.duration}
//                             onChange={(e) =>
//                               updateAccessItem(
//                                 item.id,
//                                 "duration",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                             step="0.5"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-2 text-right font-medium">
//                           ${item.cost.toFixed(2)}
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <input
//                             type="text"
//                             value={item.notes}
//                             onChange={(e) =>
//                               updateAccessItem(item.id, "notes", e.target.value)
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                             placeholder="Special notes..."
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <button
//                             onClick={() =>
//                               setAccessItems((prev) =>
//                                 prev.filter((i) => i.id !== item.id)
//                               )
//                             }
//                             className="p-2 text-red-600 hover:bg-red-50 rounded"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {accessItems.length === 0 && (
//                 <div className="text-center py-12 text-gray-500">
//                   <Building size={48} className="mx-auto mb-4 opacity-50" />
//                   <p className="text-lg">No access requirements added yet</p>
//                   <p>Add items to specify access and special requirements</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Maintenance Config Tab */}
//           {activeTab === "maintenance-config" && (
//             <div className="space-y-6">
//               <h2 className="text-2xl font-bold text-gray-900">
//                 Maintenance Configuration
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-gray-50 rounded-lg p-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                     General Settings
//                   </h3>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Labor Rate ($/hr)
//                       </label>
//                       <input
//                         type="number"
//                         value={maintenanceConfig.laborRate}
//                         onChange={(e) =>
//                           setMaintenanceConfig((prev) => ({
//                             ...prev,
//                             laborRate: parseFloat(e.target.value) || 0,
//                           }))
//                         }
//                         className="w-full p-3 border border-gray-300 rounded-lg"
//                         step="1"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Default Margin (%)
//                       </label>
//                       <input
//                         type="number"
//                         value={maintenanceConfig.margin * 100}
//                         onChange={(e) =>
//                           setMaintenanceConfig((prev) => ({
//                             ...prev,
//                             margin: (parseFloat(e.target.value) || 0) / 100,
//                           }))
//                         }
//                         className="w-full p-3 border border-gray-300 rounded-lg"
//                         step="1"
//                         max="100"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Washing Rate ($/sqm)
//                       </label>
//                       <input
//                         type="number"
//                         value={maintenanceConfig.washingRate}
//                         onChange={(e) =>
//                           setMaintenanceConfig((prev) => ({
//                             ...prev,
//                             washingRate: parseFloat(e.target.value) || 0,
//                           }))
//                         }
//                         className="w-full p-3 border border-gray-300 rounded-lg"
//                         step="0.1"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 rounded-lg p-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                     Yearly Maintenance Rates
//                   </h3>
//                   <div className="space-y-4">
//                     {Object.entries(maintenanceConfig.yearlyRates).map(
//                       ([year, rate]) => (
//                         <div key={year}>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Year {year} Rate
//                           </label>
//                           <input
//                             type="number"
//                             value={rate}
//                             onChange={(e) =>
//                               setMaintenanceConfig((prev) => ({
//                                 ...prev,
//                                 yearlyRates: {
//                                   ...prev.yearlyRates,
//                                   [parseInt(year)]:
//                                     parseFloat(e.target.value) || 0,
//                                 },
//                               }))
//                             }
//                             className="w-full p-3 border border-gray-300 rounded-lg"
//                             step="0.01"
//                             min="0"
//                             max="1"
//                           />
//                           <p className="text-xs text-gray-500 mt-1">
//                             {(rate * 100).toFixed(1)}% of base area cost
//                           </p>
//                         </div>
//                       )
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Maintenance Estimation Tab */}
//           {activeTab === "maintenance" && (
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   10-Year Maintenance Estimation
//                 </h2>
//                 <button
//                   onClick={addMaintenanceItem}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   <Plus size={20} />
//                   Add Maintenance Item
//                 </button>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse border border-gray-300 text-sm">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="border border-gray-300 p-2 text-left">
//                         Location
//                       </th>
//                       <th className="border border-gray-300 p-2 text-left">
//                         Component
//                       </th>
//                       <th className="border border-gray-300 p-2 text-left">
//                         Substrate
//                       </th>
//                       <th className="border border-gray-300 p-2 text-left">
//                         Application
//                       </th>
//                       <th className="border border-gray-300 p-2 text-right">
//                         Base Area
//                       </th>
//                       <th className="border border-gray-300 p-2 text-right">
//                         Year 1
//                       </th>
//                       <th className="border border-gray-300 p-2 text-right">
//                         Year 3
//                       </th>
//                       <th className="border border-gray-300 p-2 text-right">
//                         Year 5
//                       </th>
//                       <th className="border border-gray-300 p-2 text-right">
//                         Year 7
//                       </th>
//                       <th className="border border-gray-300 p-2 text-right">
//                         Year 10
//                       </th>
//                       <th className="border border-gray-300 p-2 text-right">
//                         Total
//                       </th>
//                       <th className="border border-gray-300 p-2 text-left">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {maintenanceItems.map((item) => (
//                       <tr key={item.id} className="hover:bg-gray-50">
//                         <td className="border border-gray-300 p-1">
//                           <select
//                             value={item.location}
//                             onChange={(e) =>
//                               updateMaintenanceItem(
//                                 item.id,
//                                 "location",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-1 border border-gray-300 rounded text-sm"
//                           >
//                             <option value="Internal">Internal</option>
//                             <option value="External">External</option>
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-1">
//                           <select
//                             value={item.component}
//                             onChange={(e) =>
//                               updateMaintenanceItem(
//                                 item.id,
//                                 "component",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-1 border border-gray-300 rounded text-sm"
//                           >
//                             <option value="">Select...</option>
//                             {COMPONENTS.map((comp) => (
//                               <option key={comp} value={comp}>
//                                 {comp}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-1">
//                           <select
//                             value={item.substrate}
//                             onChange={(e) =>
//                               updateMaintenanceItem(
//                                 item.id,
//                                 "substrate",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-1 border border-gray-300 rounded text-sm"
//                           >
//                             <option value="">Select...</option>
//                             {SUBSTRATES.map((sub) => (
//                               <option key={sub} value={sub}>
//                                 {sub}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-1">
//                           <select
//                             value={item.application}
//                             onChange={(e) =>
//                               updateMaintenanceItem(
//                                 item.id,
//                                 "application",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-1 border border-gray-300 rounded text-sm"
//                           >
//                             <option value="">Select...</option>
//                             {APPLICATIONS.map((app) => (
//                               <option key={app} value={app}>
//                                 {app}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-1">
//                           <input
//                             type="number"
//                             value={item.baseArea}
//                             onChange={(e) =>
//                               updateMaintenanceItem(
//                                 item.id,
//                                 "baseArea",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             className="w-20 p-1 border border-gray-300 rounded text-sm text-right"
//                             step="0.1"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-1 text-right text-xs">
//                           ${item.year1Cost.toFixed(0)}
//                         </td>
//                         <td className="border border-gray-300 p-1 text-right text-xs">
//                           ${item.year3Cost.toFixed(0)}
//                         </td>
//                         <td className="border border-gray-300 p-1 text-right text-xs">
//                           ${item.year5Cost.toFixed(0)}
//                         </td>
//                         <td className="border border-gray-300 p-1 text-right text-xs">
//                           ${item.year7Cost.toFixed(0)}
//                         </td>
//                         <td className="border border-gray-300 p-1 text-right text-xs">
//                           ${item.year10Cost.toFixed(0)}
//                         </td>
//                         <td className="border border-gray-300 p-1 text-right font-medium text-xs">
//                           ${item.totalMaintenanceCost.toFixed(0)}
//                         </td>
//                         <td className="border border-gray-300 p-1">
//                           <button
//                             onClick={() =>
//                               setMaintenanceItems((prev) =>
//                                 prev.filter((i) => i.id !== item.id)
//                               )
//                             }
//                             className="p-1 text-red-600 hover:bg-red-50 rounded"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {maintenanceItems.length === 0 && (
//                 <div className="text-center py-12 text-gray-500">
//                   <Wrench size={48} className="mx-auto mb-4 opacity-50" />
//                   <p className="text-lg">No maintenance items added yet</p>
//                   <p>Add items to calculate 10-year maintenance costs</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Hours by Measure Tab */}
//           {activeTab === "hours" && (
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   Hours by Measure
//                 </h2>
//                 <button
//                   onClick={addHoursItem}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   <Plus size={20} />
//                   Add Hours Item
//                 </button>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse border border-gray-300">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="border border-gray-300 p-3 text-left">
//                         Location
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Component
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Substrate
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Application
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Product
//                       </th>
//                       <th className="border border-gray-300 p-3 text-right">
//                         Area (m²)
//                       </th>
//                       <th className="border border-gray-300 p-3 text-right">
//                         Prep Hours
//                       </th>
//                       <th className="border border-gray-300 p-3 text-right">
//                         App Hours
//                       </th>
//                       <th className="border border-gray-300 p-3 text-right">
//                         Total Hours
//                       </th>
//                       <th className="border border-gray-300 p-3 text-right">
//                         Rate ($/hr)
//                       </th>
//                       <th className="border border-gray-300 p-3 text-right">
//                         Total Cost
//                       </th>
//                       <th className="border border-gray-300 p-3 text-left">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {hoursItems.map((item) => (
//                       <tr key={item.id} className="hover:bg-gray-50">
//                         <td className="border border-gray-300 p-2">
//                           <select
//                             value={item.location}
//                             onChange={(e) =>
//                               updateHoursItem(
//                                 item.id,
//                                 "location",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                           >
//                             <option value="Internal">Internal</option>
//                             <option value="External">External</option>
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <select
//                             value={item.component}
//                             onChange={(e) =>
//                               updateHoursItem(
//                                 item.id,
//                                 "component",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                           >
//                             <option value="">Select...</option>
//                             {COMPONENTS.map((comp) => (
//                               <option key={comp} value={comp}>
//                                 {comp}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <select
//                             value={item.substrate}
//                             onChange={(e) =>
//                               updateHoursItem(
//                                 item.id,
//                                 "substrate",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                           >
//                             <option value="">Select...</option>
//                             {SUBSTRATES.map((sub) => (
//                               <option key={sub} value={sub}>
//                                 {sub}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <select
//                             value={item.application}
//                             onChange={(e) =>
//                               updateHoursItem(
//                                 item.id,
//                                 "application",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                           >
//                             <option value="">Select...</option>
//                             {APPLICATIONS.map((app) => (
//                               <option key={app} value={app}>
//                                 {app}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <select
//                             value={item.product}
//                             onChange={(e) =>
//                               updateHoursItem(
//                                 item.id,
//                                 "product",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full p-2 border border-gray-300 rounded"
//                           >
//                             <option value="">Select...</option>
//                             {PRODUCTS.map((prod) => (
//                               <option key={prod} value={prod}>
//                                 {prod}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <input
//                             type="number"
//                             value={item.area}
//                             onChange={(e) =>
//                               updateHoursItem(
//                                 item.id,
//                                 "area",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             className="w-24 p-2 border border-gray-300 rounded text-right"
//                             step="0.1"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-2 text-right">
//                           {item.prepHours.toFixed(1)}
//                         </td>
//                         <td className="border border-gray-300 p-2 text-right">
//                           {item.applicationHours.toFixed(1)}
//                         </td>
//                         <td className="border border-gray-300 p-2 text-right font-medium">
//                           {item.totalHours.toFixed(1)}
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <input
//                             type="number"
//                             value={item.hourlyRate}
//                             onChange={(e) =>
//                               updateHoursItem(
//                                 item.id,
//                                 "hourlyRate",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             className="w-20 p-2 border border-gray-300 rounded text-right"
//                             step="1"
//                           />
//                         </td>
//                         <td className="border border-gray-300 p-2 text-right font-medium">
//                           ${item.totalCost.toFixed(2)}
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <button
//                             onClick={() =>
//                               setHoursItems((prev) =>
//                                 prev.filter((i) => i.id !== item.id)
//                               )
//                             }
//                             className="p-2 text-red-600 hover:bg-red-50 rounded"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {hoursItems.length === 0 && (
//                 <div className="text-center py-12 text-gray-500">
//                   <Clock size={48} className="mx-auto mb-4 opacity-50" />
//                   <p className="text-lg">No hours items added yet</p>
//                   <p>Add items to calculate detailed labor hours and costs</p>
//                 </div>
//               )}

//               {hoursItems.length > 0 && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                   <h3 className="text-lg font-semibold text-blue-900 mb-2">
//                     Hours Summary
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <div>
//                       <p className="text-sm text-blue-700">Total Prep Hours</p>
//                       <p className="text-xl font-bold text-blue-900">
//                         {hoursItems
//                           .reduce((sum, item) => sum + item.prepHours, 0)
//                           .toFixed(1)}
//                         h
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-blue-700">
//                         Total Application Hours
//                       </p>
//                       <p className="text-xl font-bold text-blue-900">
//                         {hoursItems
//                           .reduce((sum, item) => sum + item.applicationHours, 0)
//                           .toFixed(1)}
//                         h
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-blue-700">Total Hours</p>
//                       <p className="text-xl font-bold text-blue-900">
//                         {hoursItems
//                           .reduce((sum, item) => sum + item.totalHours, 0)
//                           .toFixed(1)}
//                         h
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-blue-700">Total Labor Cost</p>
//                       <p className="text-xl font-bold text-blue-900">
//                         $
//                         {hoursItems
//                           .reduce((sum, item) => sum + item.totalCost, 0)
//                           .toFixed(0)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
