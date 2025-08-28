import LoadingScreen from "@/components/LoadingScreen";
import Page from "@/components/page";
import PrescriptionDetails from "@/components/prescriptions/PrescriptionDetails";
import { PrescriptionService } from "@/services/PrescriptionsServise";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

const Prescription = () => {
  const { id } = useLocalSearchParams();
  const service = PrescriptionService.make();
  const { data: prescription, isLoading } = useQuery({
    queryKey: [`prescription_${id}`],
    queryFn: () => service.show(parseInt(id as string)),
    select(data) {
      return data.data;
    },
  });

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <Page>
      <PrescriptionDetails prescription={prescription} />
    </Page>
  );
};

export default Prescription;
