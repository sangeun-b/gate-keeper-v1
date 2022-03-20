import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';

@Injectable()
export class AppService {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}
  getHello(): string {
    // console.log(this.firebase);
    console.log(this.firebase.storage);
    console.log(process.env.NEXT_PUBLIC_FIRBASE_PROJECT_ID);
    return 'Hello World!';
  }
}
