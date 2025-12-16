import { VEHICLE_OPTIONS } from "@/app/types/vehicles";
import { WorkflowState } from "@/app/types/auth";
import SelectInput from "../inputs/SelectInput";
import ImageInputForm from "../inputs/ImageInputForm";
import DataInputForm from "../inputs/DataInputForm";

export interface ChatInputProps {
  state: WorkflowState;
  onSubmit: (input: string | File) => void;
}


export function ChatInput({ state, onSubmit }: ChatInputProps) {

  if (state === "applicationsuccess") return null;

  if (
    state === "vehiclebrandselection" ||
    state === "vehiclemodelselection" ||
    state === "vehiclevariantselection"
  ) {
    return (
      <div className="p-3 border-t">
        <SelectInput
          key={state}
          options={VEHICLE_OPTIONS[state]}
          onSelect={(value) => onSubmit(value)}
        />
      </div>
    );
  }


  if (state === "uploadpan" || state === "uploadesign") {
    return (
      <div className="p-3 border-t ">
        <ImageInputForm onSubmit={onSubmit} />
      </div>
    );
  }

  return (
    <DataInputForm state={state} onSubmit={onSubmit} />
  );
}
