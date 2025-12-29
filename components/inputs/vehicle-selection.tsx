
import { WorkflowState, WorkflowStates } from "@/types/auth";
import { VEHICLE_OPTIONS } from "@/types/vehicles";
import { ChangeEvent } from "react";

interface VehicleSelectionProps {
    state: WorkflowState;
    vehicleData: {
        brand: string;
        model: string;
        variant: string;
    };
    setVehicleData: (data: any) => void;
    setWorkflowState: (state: WorkflowState) => void;
    onInteract: (input: string) => void;
}

export default function VehicleSelection({
    state,
    vehicleData,
    setVehicleData,
    setWorkflowState,
    onInteract
}: VehicleSelectionProps) {

    const isSelectionActive = [
        WorkflowStates.VEHICLE_BRAND_SELECTION,
        WorkflowStates.VEHICLE_MODEL_SELECTION,
        WorkflowStates.VEHICLE_VARIANT_SELECTION
    ].includes(state);

    const isFrozen = !isSelectionActive;

    const handleBrandChange = (e: ChangeEvent<HTMLSelectElement>) => {
        if (isFrozen) return;
        const val = e.target.value;
        if (state === WorkflowStates.VEHICLE_BRAND_SELECTION) {
            onInteract(val);
        } else {
            setVehicleData((prev: any) => ({ ...prev, brand: val, model: "", variant: "" }));
            setWorkflowState(WorkflowStates.VEHICLE_MODEL_SELECTION);
        }
    };

    const handleModelChange = (e: ChangeEvent<HTMLSelectElement>) => {
        if (isFrozen) return;
        const val = e.target.value;
        if (state === WorkflowStates.VEHICLE_VARIANT_SELECTION) {
            onInteract(val);
        } else {
            setVehicleData((prev: any) => ({ ...prev, model: val, variant: "" }));
            setWorkflowState(WorkflowStates.VEHICLE_VARIANT_SELECTION);
        }
    };

    const handleVariantChange = (e: ChangeEvent<HTMLSelectElement>) => {
        if (isFrozen) return;
        const val = e.target.value;
        onInteract(val);
    };

    return (
        <div className={`flex flex-col gap-3 p-3 bg-gray-100 rounded-lg max-w-sm mt-2 ${isFrozen ? 'opacity-80 pointer-events-none' : ''}`}>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Brand</label>
                <select
                    className="w-full p-2 border rounded bg-white text-black text-sm disabled:bg-gray-200"
                    value={vehicleData.brand}
                    onChange={handleBrandChange}
                    disabled={isFrozen}
                >
                    <option value="" disabled>Select Brand</option>
                    {VEHICLE_OPTIONS.vehiclebrandselection.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>

            <div className={`${!vehicleData.brand ? 'opacity-50' : ''}`}>
                <label className="block text-xs font-medium text-gray-700 mb-1">Model</label>
                <select
                    className="w-full p-2 border rounded bg-white text-black text-sm disabled:bg-gray-200"
                    value={vehicleData.model}
                    onChange={handleModelChange}
                    disabled={!vehicleData.brand || isFrozen}
                >
                    <option value="" disabled>Select Model</option>
                    {VEHICLE_OPTIONS.vehiclemodelselection.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>

            <div className={`${!vehicleData.model ? 'opacity-50' : ''}`}>
                <label className="block text-xs font-medium text-gray-700 mb-1">Variant</label>
                <select
                    className="w-full p-2 border rounded bg-white text-black text-sm disabled:bg-gray-200"
                    value={vehicleData.variant}
                    onChange={handleVariantChange}
                    disabled={!vehicleData.model || isFrozen}
                >
                    <option value="" disabled>Select Variant</option>
                    {VEHICLE_OPTIONS.vehiclevariantselection.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
