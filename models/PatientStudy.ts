export default interface PatientStudy {
  id: number;
  uuid: string;
  patient_uuid: string;
  customer_id: number;
  study_uuid: string;
  study_uid: string;
  study_date: string;
  title: string;
  available_modes: {
    modalities: string[];
    validModes: {
      id: string;
      displayName: string;
      description: string;
      url: string;
    }[];
  };
}
