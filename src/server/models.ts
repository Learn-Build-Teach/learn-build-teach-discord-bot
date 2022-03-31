export interface ReturnBody {
  err: string | null;
  data: any;
}

export class ReturnValue {
  status: number;
  body: ReturnBody;

  constructor() {
    this.status = 200;
    this.body = {
      err: null,
      data: null,
    };
  }
}
