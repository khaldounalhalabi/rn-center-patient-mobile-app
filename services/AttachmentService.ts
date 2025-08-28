import { Media } from "@/models/Media";
import { BaseService } from "./BaseService";

class AttachmentService extends BaseService<AttachmentService, Media>() {
  public getBaseUrl(): string {
    return `/customer/attachments`;
  }
}

export default AttachmentService;
