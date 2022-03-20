import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { firebase } from 'src/firebase/initFirebase';
// import firebase from 'src/firebase2/initFirebase2';

async function bootstrap() {
  console.log('connect');
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
}
// getFirebaseAdmin();
bootstrap();
