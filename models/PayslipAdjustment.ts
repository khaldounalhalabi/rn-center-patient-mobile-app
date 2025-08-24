import PayslipAdjustmentTypeEnum from "@/enums/PayslipAdjustmentTypeEnum";

interface PayslipAdjustment {
  id: number;
  payslip_id: number;
  amount: number;
  reason?: string;
  type: PayslipAdjustmentTypeEnum;
}

export default PayslipAdjustment;
