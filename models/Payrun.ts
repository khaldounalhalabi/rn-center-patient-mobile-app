import PayrunStatusEnum from "@/enums/PayrunStatusEnum";

interface Payrun {
  id: number;
  status: PayrunStatusEnum;
  payment_date: string;
  payment_cost: number;
  period: string;
  from: string;
  to: string;
  has_errors: boolean;
  processed_at: string;
  processed_users_count: number;
  excluded_users_count: number;
  can_update?: boolean;
  can_delete?: boolean;
  should_delivered_at:string
}

export default Payrun;
