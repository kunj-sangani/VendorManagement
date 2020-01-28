import { sp } from "@pnp/sp";

export default class commonService {

    public async getData(listName: string, itemId: number) {
        return new Promise<any>((resolve, reject) => {
            sp.web.lists.getByTitle(listName).items.getById(itemId).get().then((val) => {
                resolve(val);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public async getAllData(listName: string) {
        return new Promise<any>((resolve, reject) => {
            sp.web.lists.getByTitle(listName).items.getAll().then((val) => {
                resolve(val);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public async addData(listName: string, itemData: any) {
        return new Promise<any>((resolve, reject) => {
            sp.web.lists.getByTitle(listName).items.add(itemData).then((val) => {
                resolve(val);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public async updateData(listName: string, itemData: any, itemId: number) {
        return new Promise<any>((resolve, reject) => {
            sp.web.lists.getByTitle(listName).items.getById(itemId).update(itemData).then((val) => {
                resolve(val);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public async deleteData(listName: string, itemId: number) {
        return new Promise<any>((resolve, reject) => {
            sp.web.lists.getByTitle(listName).items.getById(itemId).delete().then((val) => {
                resolve(val);
            }).catch((error) => {
                reject(error);
            });
        });
    }

}