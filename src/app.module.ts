import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as connectionOptions from './ormconfig';
import { PostsModule } from './posts/posts.module';

console.log(process.env.POSTGRES_USER);
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(connectionOptions),
    PostsModule,
  ],
})
export class AppModule {}
