export class Products {
    constructor(
        public _id: string,
        public _rev: string, // ✅ Add this to store CouchDB revision
        public name: string,
        public price: number,
        public stock: number,
        public category: string,
        public createdAt: string | Date // ✅ Ensure `createdAt` is defined as both `string` and `Date`
    ) {}
}