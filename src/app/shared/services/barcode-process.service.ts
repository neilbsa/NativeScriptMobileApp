import { Injectable } from '@angular/core';
import { BarcodeModel } from '../model/barcode-model';

@Injectable({
  providedIn: 'root'
})
export class BarcodeProcessService {

  constructor() { }

  parseIaBarcodeData(barcode : string): BarcodeModel{
    const colon = barcode.indexOf(':');
    const firstSwirl = barcode.indexOf('~');
    const SecondSwirl = barcode.indexOf('~', (firstSwirl+1));
    const blocking = barcode.indexOf('|');

    const companyId = barcode.substring(colon+1,firstSwirl);
    const type = barcode.substring(firstSwirl+1,SecondSwirl);
    const Id = barcode.substring(SecondSwirl+1,blocking);

    return new BarcodeModel(type,companyId,+Id);
  }


  parseBarcodeData(barcode : string): BarcodeModel{
    const colon = barcode.indexOf(':');
    const firstSwirl = barcode.indexOf('~');
    const SecondSwirl = barcode.indexOf('~', (firstSwirl+1));
    const blocking = barcode.indexOf('|');

    const type = barcode.substring(colon+1,firstSwirl);
    const Id = barcode.substring(firstSwirl+1,SecondSwirl);
    const companyId = barcode.substring(SecondSwirl+1,blocking);

    return new BarcodeModel(type,companyId,+Id);
  }
}
