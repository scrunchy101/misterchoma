
export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  status: string;
  targetCompletion: number;
  targets: {
    id: string;
    target_name: string;
    target_value: number;
    current_value: number;
    end_date: string;
    progress: number;
  }[];
}
