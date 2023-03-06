
import { BaseRepository } from "../core/doc-mangement/base.document.repository";
import { DocumentEntity } from "./Document.entity";

export class DocumentRepository extends BaseRepository<DocumentEntity> {
    protected getKey(site: DocumentEntity): string {
        return `${site.documentId}`;
    }

}
