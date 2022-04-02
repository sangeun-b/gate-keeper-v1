import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
  Optional,
  mixin,
  Type,
} from '@nestjs/common';
import { FileInterceptor, MulterModuleOptions } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { MULTER_MODULE_OPTIONS } from '@nestjs/platform-express/multer/files.constants';
import * as multer from 'multer';

export const MyNewFileInterceptor = (
  fieldName: string,
  localOptions?: (context: ExecutionContext) => MulterOptions,
) => {
  const FileInterceptorInstance = FileInterceptor(fieldName);

  class MixinInterceptor extends FileInterceptorInstance {
    protected multer: any;
    // eslint-disable-next-line @typescript-eslint/ban-types
    protected moduleOptions: {};

    constructor(
      @Optional()
      @Inject(MULTER_MODULE_OPTIONS)
      options: MulterModuleOptions = {},
    ) {
      super();
      this.moduleOptions = options;
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): any {
      this.multer = (multer as any)({
        ...this.moduleOptions,
        ...localOptions(context),
      });
      return super.intercept(context, next);
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
};
